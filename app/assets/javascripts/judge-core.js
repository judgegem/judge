// Judge 1.5.0
// (c) 2011–2012 Joe Corcoran
// http://raw.github.com/joecorcoran/judge/master/LICENSE.txt
// This is judge-core.js: the main part of the JavaScript part of Judge.
// Judge is a client-side validation gem for Rails 3.
// You can find the Judge gem API documentation at <http://joecorcoran.github.com/judge/>.
// Hopefully the comments here will help you understand what's happening under the hood.

/*jshint curly: true, evil: true, newcap: true, noarg: true, strict: false */
/*global window: false, _: false, JSON: false */  

(function() {

  var root = this;

  // The judge namespace.
  var judge = root.judge = {};

  judge.VERSION = '1.5.0';

  // Trying to be a bit more descriptive than the basic error types allow.
  var DependencyError = function(message) {
    this.name = 'DependencyError';
    this.message = message;
  };
  DependencyError.prototype = new Error();
  DependencyError.prototype.constructor = DependencyError;

  // Returns the object type as represented in `Object.prototype.toString`.
  var objectString = function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  };

  // A way of checking isArray, but including weird object types that are returned from collection queries.
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

  // OMG! How can you use eval, you monster! It's totally evil!
  // (It's used here for stuff like `(3, '<', 4) => '3 < 4' => true`.)
  var operate = function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  };

  // Some nifty numerical helpers.
  var
    isInt   = function(value) { return value === +value && value === (value|0); },
    isEven  = function(value) { return (value % 2 === 0) ? true : false; },
    isOdd   = function(value) { return !isEven(value); };

  // Converts a Ruby regular expression, given as a string, into JavaScript.
  // This is rudimentary at best, as there are many, many differences between Ruby
  // and JavaScript when it comes to regexp-fu. Basically, if you validate your records
  // using complex regular expressions AND you hope that this will "just work"
  // on the client-side too&hellip; you are going to be pretty disappointed.
  // If you know of a better way (or an existing library) to convert regular expressions 
  // from Ruby to JavaScript, I would really love to hear from you.
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
    return (new root.ActiveXObject('Microsoft.XMLHTTP')) || (new root.XMLHttpRequest()) || null;
  };
  // Performs a GET request using the browser's XHR object. The callback function is executed when the XHR
  // object's readyState is changed. This provides very basic ajax capability for use in the standard uniqueness
  // validator. If you wish to perform custom ajax validation, or override standard validators by sending requests
  // to the validation controller, you should use something more robust like jQuery or Zepto.
  var get = function(path, callback) {
    var req = reqObj();
    if (!!req) {
      req.onreadystatechange = function() {
        if (req.readyState === 4 && _.isFunction(callback)) {
          callback(req.responseText);
        }
      };
      req.open('GET', path, true);
      req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      req.send();
    }
    return req;
  };

  // A judge.Watcher is a DOM element wrapper that judge uses to store validation info and instance methods.
  judge.Watcher = function (element) {
    // Throw dependency errors.
    if (typeof root._ === 'undefined') {
      throw new DependencyError('Ensure underscore.js is loaded');
    }
    if (_.isUndefined(root.JSON)) {
      throw new DependencyError('Ensure that your browser provides the JSON object or that json2.js is loaded');
    }

    // Throw some constructor usage errors.
    if (_.isUndefined(element)) {
      throw new ReferenceError('No DOM element passed to judge.Watcher constructor');
    }
    if (element.getAttribute('data-validate') === null) {
      throw new ReferenceError('DOM element does not have data-validate attribute – please use Judge::FormBuilder');
    }

    // Watcher instance properties.
    this.element    = element;
    this.validators = JSON.parse(this.element.getAttribute('data-validate'));
  };

  // The `validate` method returns an object which describes the current validity of the
  // value of the watched element.
  judge.Watcher.prototype.validate = function(callback) {
    var messages         = [],
        availableMethods = _.extend(judge.eachValidators, judge.customValidators),
        isValid;
    _(this.validators).each(function(v) {
      if (this.element.value.length || v.options.allow_blank !== true) {
        var validationMethod   = _.bind(availableMethods[v.kind], this.element),
            validationMessages = validationMethod(v.options, v.messages);
        if (validationMessages.length) { messages.push(validationMessages); }
      }
    }, this);
    messages = _.flatten(messages);
    isValid = (messages.length < 1);
    if (_.isFunction(callback)) {
      callback(isValid, messages, this.element);
    }
    return {
      valid: isValid, 
      messages: messages,
      element: this.element
    };
  };

  // Ported ActiveModel validators.
  // See <http://api.rubyonrails.org/classes/ActiveModel/Validations.html> for the originals.
  judge.eachValidators = (function() {
    return {
      // ActiveModel::Validations::PresenceValidator
      presence: function(options, messages) {
        return (this.value.length) ? [] : [messages.blank];
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
        return msgs;
      },
      
      // ActiveModel::Validations::ExclusionValidator
      exclusion: function(options, messages) {
        var stringIn = _(options['in']).map(function(o) { return o.toString(); });
        return (_(stringIn).include(this.value)) ? [messages.exclusion] : [];
      },
      
      // ActiveModel::Validations::InclusionValidator
      inclusion: function(options, messages) {
        var stringIn = _(options['in']).map(function(o) { return o.toString(); });
        return (!_(stringIn).include(this.value)) ? [messages.inclusion] : [];
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
          if (options.odd && isEven(parsedValue)) {
            msgs.push(messages.odd);
          }
          if (options.even && isOdd(parsedValue)) {
            msgs.push(messages.even);
          }
          if (options.only_integer && !isInt(parsedValue)) {
            msgs.push(messages.not_an_integer);
          }
          _(operators).each(function(operator, key) {
            var valid = operate(parsedValue, operators[key], parseFloat(options[key], 10));
            if (_(options).has(key) && !valid) {
              msgs.push(messages[key]);
            }
          });
        }
        return msgs;
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
        return msgs;
      },
      
      // ActiveModel::Validations::AcceptanceValidator
      acceptance: function(options, messages) {
        return (this.checked === true) ? [] : [messages.accepted];
      },
      
      // ActiveModel::Validations::ConfirmationValidator
      confirmation: function(options, messages) {
        var id       = this.getAttribute('id'),
            confId   = id + '_confirmation',
            confElem = root.document.getElementById(confId);
        return (this.value === confElem.value) ? [] : [messages.confirmation];
      },

      // Uniqueness
      uniqueness: function(options, messages) {

      }
    };

  })();

  // This object should contain any judge validation methods
  // that correspond to custom validators used in the model.
  judge.customValidators = {};

  // Validate all given element(s) without storing. Watcher creation is handled for you,
  // but the created Watchers will not be returned, so it's less flexible.
  judge.validate = function(elements, callback) {
    var results = [];
    elements = isCollection(elements) ? elements : [elements];
    _(elements).each(function(element) {
      var j = new judge.Watcher(element);
      results.push(j.validate(callback));
    });
    return results;
  };

  // Specify which utility functions to share across extensions
  judge.util = (function() {
    return {
      isCollection: isCollection
    };
  })();

}).call(this);