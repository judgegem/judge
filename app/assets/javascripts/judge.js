// Judge {version}
// (c) 2011–2012 Joe Corcoran
// http://raw.github.com/joecorcoran/judge/master/LICENSE.txt

// This is judge.js: the JavaScript part of Judge. Judge is a client-side
// validation gem for Rails 3. You can find the Judge gem API documentation at
// <http://joecorcoran.github.com/judge/>. Hopefully the comments here will help
// you understand what's happening under the hood.

(function() {

  var root = this;

  // The judge namespace.
  var judge = root.judge = {},
      _     = root._;

  judge.VERSION = '{version}';

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
    isInt  = function(value) { return value === +value && value === (value|0); },
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
  var get = judge.get = function(url, success, error) {
    var req = reqObj();
    if (!!req) {
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          req.onreadystatechange = void 0;
          var callback = /^20\d$/.test(req.status) ? success : error;
          callback(req.status, req.responseHeaders, req.responseText);
        }
      };
      req.open('GET', url, true);
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
          'class'    : classFromName(el.name),
          'attribute': attrFromName(el.name),
          'value'    : encodeURIComponent(el.value),
          'kind'     : kind
        };
    return encodeURI(path + queryString(params));
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
    on: function(event, callback, scope) {
      if (!_.isFunction(callback)) return this;
      this._events || (this._events = {});
      var events = this._events[event] || (this._events[event] = []);
      events.push({ callback: callback, scope: scope || this });
      this.trigger('bind');
      return this;
    },
    trigger: function(event) {
      if (!this._events) return this;
      var args      = _.rest(arguments),
          events = this._events[event] || (this._events[event] = []);
      _.each(events, function(event) {
        event.callback.apply(event.scope, args);
      });
      return this;
    }
  };

  // A queue of closed or pending Validation objects.
  var ValidationQueue = judge.ValidationQueue = function(element) {
    this.element        = element;
    this.validations    = [];
    this.attrValidators = root.JSON.parse(this.element.getAttribute('data-validate'));
    
    var allValidators = _.extend(judge.eachValidators, judge.customValidators);
    _.each(this.attrValidators, function(av) {
      if (this.element.value.length || av.options.allow_blank !== true) {
        var method     = _.bind(allValidators[av.kind], this.element),
            validation = method(av.options, av.messages);
        validation.on('close', this.tryClose, this);
        this.on('bind', this.tryClose, this);
        this.validations.push(validation);
      }
    }, this);
    this.tryClose.call(this);
  };
  _.extend(ValidationQueue.prototype, Dispatcher, {
    tryClose: function() {
      var report = _.reduce(this.validations, function(obj, validation) {
        obj.statuses = _.union(obj.statuses, [validation.status()]);
        obj.messages = _.union(obj.messages, _.compact(validation.messages));
        return obj;
      }, { statuses: [], messages: [] }, this);
      if (_.contains(report.statuses, 'pending')) return false;
      var status = _.contains(report.statuses, 'invalid') ? 'invalid' : 'valid';
      this.trigger('close', this.element, status, report.messages);
      this.trigger(status, this.element, report.messages);
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

  // Ported ActiveModel validators.
  // See <http://api.rubyonrails.org/classes/ActiveModel/Validations.html> for
  // the originals.
  judge.eachValidators = {
    // ActiveModel::Validations::PresenceValidator
    presence: function(options, messages) {
      return new Validation(this.value.length ? [] : [messages.blank]);
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
      return new Validation(msgs);
    },
    
    // ActiveModel::Validations::ExclusionValidator
    exclusion: function(options, messages) {
      var stringIn = _(options['in']).map(function(o) {
        return o.toString();
      });
      return new Validation(
        _.include(stringIn, this.value) ? [messages.exclusion] : []
      );
    },
    
    // ActiveModel::Validations::InclusionValidator
    inclusion: function(options, messages) {
      var stringIn = _(options['in']).map(function(o) {
        return o.toString();
      });
      return new Validation(
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
      return new Validation(msgs);
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
      return new Validation(msgs);
    },
    
    // ActiveModel::Validations::AcceptanceValidator
    acceptance: function(options, messages) {
      return new Validation(this.checked === true ? [] : [messages.accepted]);
    },
    
    // ActiveModel::Validations::ConfirmationValidator
    confirmation: function(options, messages) {
      var id       = this.getAttribute('id'),
          confId   = id + '_confirmation',
          confElem = root.document.getElementById(confId);
      return new Validation(
        this.value === confElem.value ? [] : [messages.confirmation]
      );
    },

    // ActiveModel::Validations::UniquenessValidator
    uniqueness: function(options, messages) {
      var validation = new Validation();          
      get(urlFor(this, 'uniqueness'),
        function(status, headers, text) {
          validation.close(text);
        },
        function(status, headers, text) {
          validation.close(['Request error: ' + status]);
        }
      );
      return validation;
    }
  };

  // This object should contain any custom EachValidator methods, named
  // to correspond to custom validators used in the model.
  judge.customValidators = {};

  // Convenience method for validating a form element. Pass either a single
  // callback or one for valid and one for invalid, e.g.
  //
  //   judge.validate(el, function(status, messages) {
  //     /* status is 'valid' or 'invalid' */
  //   });
  //
  //   judge.validate(el, function() {
  //     /* valid */
  //   },
  //   function(messages) {
  //     /* invalid */
  //   });
  judge.validate = function(element) {
    var callbacks = _.rest(arguments),
        queue     = new ValidationQueue(element);
    if (callbacks.length > 1) {
      queue.on('valid', callbacks[0]);
      queue.on('invalid', callbacks[1]);
    } else {
      queue.on('close', callbacks[0]);
    }
    return queue;
  };

}).call(this);