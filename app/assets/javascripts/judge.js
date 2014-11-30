// Judge 2.0.5
// (c) 2011-2013 Joe Corcoran
// http://raw.github.com/joecorcoran/judge/master/LICENSE.txt

// This is judge.js: the JavaScript part of Judge. Judge is a client-side
// validation gem for Rails 3. You can find the Judge gem API documentation at
// <http://judge.joecorcoran.co.uk>.

(function() {

  var root = this;

  // The judge namespace.
  var judge = root.judge = {},
      _     = root._;

  judge.VERSION = '2.0.5';

  // Trying to be a bit more descriptive than the basic error types allow.
  var DependencyError = function(message) {
    this.name = 'DependencyError';
    this.message = message;
  };
  DependencyError.prototype = new Error();
  DependencyError.prototype.constructor = DependencyError;

  // Throw dependency errors if necessary.
  if (typeof _ === 'undefined') {
    throw new DependencyError('Ensure underscore.js is loaded');
  }
  if (_.isUndefined(root.JSON)) {
    throw new DependencyError(
      'Judge depends on the global JSON object (load json2.js in old browsers)'
    );
  }

  // Returns the object type as represented in `Object.prototype.toString`.
  var objectString = function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  };

  // A way of checking isArray, but including weird object types that are
  // returned from collection queries.
  var isCollection = function(object) {
    var type  = objectString(object),
        types = [
          'Array',
          'NodeList',
          'StaticNodeList',
          'HTMLCollection',
          'HTMLFormElement',
          'HTMLAllCollection'
        ];
    return _(types).include(type);
  };

  // eval is used here for stuff like `(3, '<', 4) => '3 < 4' => true`.
  var operate = function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  };

  // Some nifty numerical helpers.
  var
    isInt  = function(value) { return Math.round(value) == value; },
    isEven = function(value) { return (value % 2 === 0) ? true : false; },
    isOdd  = function(value) { return !isEven(value); };

  // Converts a Ruby regular expression, given as a string, into JavaScript.
  // This is rudimentary at best, as there are many, many differences between
  // Ruby and JavaScript when it comes to regexp-fu. The plan is to replace this
  // with an XRegExp plugin which will port some Ruby regexp features to
  // JavaScript.
  var convertFlags = function(string) {
    var on = string.split('-')[0];
    return (/m/.test(on)) ? 'm' : '';
  };
  var convertRegExp = function(string) {
    var parts  = string.slice(1, -1).split(':'),
        flags  = parts.shift().replace('?', ''),
        source = parts.join(':').replace(/\\\\/g, '\\');
    return new RegExp(source, convertFlags(flags));
  };

  // Returns a browser-specific XHR object, or null if one cannot be constructed.
  var reqObj = function() {
    return (
      (root.ActiveXObject && new root.ActiveXObject('Microsoft.XMLHTTP')) ||
      (root.XMLHttpRequest && new root.XMLHttpRequest()) ||
      null
    );
  };

  // Performs a GET request using the browser's XHR object. This provides very
  // basic ajax capability and was written specifically for use in the provided
  // uniqueness validator without requiring jQuery.
  var get = judge.get = function(url, callbacks) {
    var req = reqObj();
    if (!!req) {
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          req.onreadystatechange = function() {};
          var callback = /^20\d$/.test(req.status) ? callbacks.success : callbacks['error'];
          callback(req.status, req.responseHeaders, req.responseText);
        }
      };
      req.open('GET', url, true);
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      req.setRequestHeader('Accept', 'application/json');
      req.send();
    }
    return req;
  };

  // Some helper methods for working with Rails-style input attributes.
  var
    attrFromName = function(name) {
      var matches, attr = '';
      if (matches = name.match(/\[(\w+)\]$/)) {
        attr = matches[1];
      }
      return attr;
    };
    classFromName = function(name) {
      var bracketed, klass = '';
      if (bracketed = name.match(/\[(\w+)\]/g)) {
        klass = (bracketed.length > 1) ? camelize(debracket(bracketed[0])) : name.match(/^\w+/)[0];
      }
      return klass;
    };
    debracket = function(str) {
      return str.replace(/\[|\]/g, '');
    };
    camelize = function(str) {
      return str.replace(/(^[a-z]|\_[a-z])/g, function($1) {
        return $1.toUpperCase().replace('_','');
      });
    };

  // Build the URL necessary to send a GET request to the mounted validations
  // controller to check the validity of the given form element.
  var urlFor = judge.urlFor = function(el, kind) {
    var path   = judge.enginePath,
        params = {
          'klass'    : classFromName(el.name),
          'attribute': attrFromName(el.name),
          'value'    : el.value,
          'kind'     : kind
        };
    return path + queryString(params);
  };

  // Convert an object literal into an encoded query string.
  var queryString = function(obj) {
    var e  = encodeURIComponent,
        qs = _.reduce(obj, function(memo, value, key) {
      return memo + e(key) + '=' + e(value) + '&';
    }, '?');
    return qs.replace(/&$/, '').replace(/%20/g, '+');
  };

  // Default path to mounted engine. Override this if you decide to mount
  // Judge::Engine at a different location.
  judge.enginePath = '/judge';

  // Provides event dispatch behaviour when mixed into an object. Concept
  // taken from Backbone.js, stripped down and altered.
  // Backbone.js (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
  // http://backbonejs.org
  var Dispatcher = judge.Dispatcher = {
    on: function(eventName, callback, scope) {
      if (!_.isFunction(callback)) return this;
      this._events || (this._events = {});
      var events = this._events[eventName] || (this._events[eventName] = []);
      events.push({ callback: callback, scope: scope || this });
      if (eventName !== 'bind') {
        this.trigger('bind', eventName);
      }
      return this;
    },
    trigger: function(eventName) {
      if (!this._events) return this;
      var args   = _.rest(arguments),
          events = this._events[eventName] || (this._events[eventName] = []);
      _.each(events, function(eventObj) {
        eventObj.callback.apply(eventObj.scope, args);
      });
      return this;
    }
  };

  // A queue of closed or pending Validation objects.
  var ValidationQueue = judge.ValidationQueue = function(element) {
    this.element        = element;
    this.validations    = [];
    this.attrValidators = root.JSON.parse(this.element.getAttribute('data-validate'));

    _.each(this.attrValidators, function(av) {
      if (this.element.value.length || av.options.allow_blank !== true) {
        var method     = _.bind(judge.eachValidators[av.kind], this.element),
            validation = method(av.options, av.messages);
        validation.on('close', this.tryClose, this);
        this.validations.push(validation);
      }
    }, this);

    this.on('bind', this.tryClose, this);
  };

  _.extend(ValidationQueue.prototype, Dispatcher, {
    tryClose: function(eventName) {
      var report = _.reduce(this.validations, function(obj, validation) {
        obj.statuses = _.union(obj.statuses, [validation.status()]);
        obj.messages = _.union(obj.messages, _.compact(validation.messages));
        return obj;
      }, { statuses: [], messages: [] }, this);

      if (!_.contains(report.statuses, 'pending')) {
        var status = _.contains(report.statuses, 'invalid') ? 'invalid' : 'valid';

        // handle single callback
        this.trigger('close', this.element, status, report.messages);

        // handle named callbacks
        if (status === eventName) {
          this.trigger(status, this.element, report.messages);
        }
      }
    }
  });

  // Event-capable object returned by validator methods.
  var Validation = judge.Validation = function(messages) {
    this.messages = null;
    if (_.isArray(messages)) this.close(messages);
    return this;
  };
  _.extend(Validation.prototype, Dispatcher, {
    close: function(messages) {
      if (this.closed()) return null;
      this.messages = _.isString(messages) ? root.JSON.parse(messages) : messages;
      this.trigger('close', this.status(), this.messages);
      return this;
    },
    closed: function() {
      return _.isArray(this.messages);
    },
    status: function() {
      if (!this.closed()) return 'pending';
      return this.messages.length > 0 ? 'invalid' : 'valid';
    }
  });

  // Convenience methods for creating Validation objects in different states.
  var pending = judge.pending = function() {
    return new Validation();
  };
  var closed = judge.closed = function(messages) {
    return new Validation(messages);
  };

  // Ported ActiveModel validators.
  // See <http://api.rubyonrails.org/classes/ActiveModel/Validations.html> for
  // the originals.
  judge.eachValidators = {
    // ActiveModel::Validations::PresenceValidator
    presence: function(options, messages) {
      return closed(this.value.length ? [] : [messages.blank]);
    },
    
    // ActiveModel::Validations::LengthValidator
    length: function(options, messages) {
      var msgs = [],
          types = {
            minimum: { operator: '<',  message: 'too_short' },
            maximum: { operator: '>',  message: 'too_long' },
            is:      { operator: '!=', message: 'wrong_length' }
          };
      _(types).each(function(properties, type) {
        var invalid = operate(this.value.length, properties.operator, options[type]);
        if (_(options).has(type) && invalid) {
          msgs.push(messages[properties.message]);
        }
      }, this);
      return closed(msgs);
    },
    
    // ActiveModel::Validations::ExclusionValidator
    exclusion: function(options, messages) {
      var stringIn = _(options['in']).map(function(o) {
        return o.toString();
      });
      return closed(
        _.include(stringIn, this.value) ? [messages.exclusion] : []
      );
    },
    
    // ActiveModel::Validations::InclusionValidator
    inclusion: function(options, messages) {
      var stringIn = _(options['in']).map(function(o) {
        return o.toString();
      });
      return closed(
        !_.include(stringIn, this.value) ? [messages.inclusion] : []
      );
    },
    
    // ActiveModel::Validations::NumericalityValidator
    numericality: function(options, messages) {
      var operators = {
            greater_than: '>',
            greater_than_or_equal_to: '>=',
            equal_to: '==',
            less_than: '<',
            less_than_or_equal_to: '<='
          },
          msgs = [],
          parsedValue = parseFloat(this.value, 10); 

      if (isNaN(Number(this.value))) {
        msgs.push(messages.not_a_number);
      } else {
        if (options.odd && isEven(parsedValue)) msgs.push(messages.odd);
        if (options.even && isOdd(parsedValue)) msgs.push(messages.even);
        if (options.only_integer && !isInt(parsedValue)) msgs.push(messages.not_an_integer);
        _(operators).each(function(operator, key) {
          var valid = operate(parsedValue, operators[key], parseFloat(options[key], 10));
          if (_(options).has(key) && !valid) {
            msgs.push(messages[key]);
          }
        });
      }
      return closed(msgs);
    },
    
    // ActiveModel::Validations::FormatValidator
    format: function(options, messages) {
      var msgs  = [];
      if (_(options).has('with')) {
        var withReg = convertRegExp(options['with']);
        if (!withReg.test(this.value)) {
          msgs.push(messages.invalid);
        }
      }
      if (_(options).has('without')) {
        var withoutReg = convertRegExp(options.without);
        if (withoutReg.test(this.value)) {
          msgs.push(messages.invalid);
        }
      }
      return closed(msgs);
    },
    
    // ActiveModel::Validations::AcceptanceValidator
    acceptance: function(options, messages) {
      return closed(this.checked === true ? [] : [messages.accepted]);
    },
    
    // ActiveModel::Validations::ConfirmationValidator
    confirmation: function(options, messages) {
      var id       = this.getAttribute('id'),
          confId   = id + '_confirmation',
          confElem = root.document.getElementById(confId);
      return closed(
        this.value === confElem.value ? [] : [messages.confirmation]
      );
    },

    // ActiveModel::Validations::UniquenessValidator
    uniqueness: function(options, messages) {
      var validation = pending();          
      get(urlFor(this, 'uniqueness'), {
        success: function(status, headers, text) {
          validation.close(text);
        },
        error: function(status, headers, text) {
          validation.close(['Request error: ' + status]);
        }
      });
      return validation;
    }
  };

  var isCallbacksObj = function(obj) {
    return _.isObject(obj) && _.has(obj, 'valid') && _.has(obj, 'invalid');
  };

  // Method for validating a form element. Pass either a single
  // callback or one for valid and one for invalid.
  judge.validate = function(element, callbacks) {
    var queue = new ValidationQueue(element);
    if (_.isFunction(callbacks)) {
      queue.on('close', callbacks);
    } else if (isCallbacksObj(callbacks)) {
      queue.on('valid', callbacks.valid);
      queue.on('invalid', callbacks.invalid);
    }
    return queue;
  };

}).call(this);
