/*jshint curly: true, evil: true, newcap: true, noarg: true */
/*global _: false, JSON: false */

// namespace
var judge = judge || {};

// Watcher constructor
judge.Watcher = function (element) {
  
  // dependency errors
  if (!window.hasOwnProperty('_')) {
    throw new ReferenceError('[judge] Underscore.js not found');
  }
  if (!window.hasOwnProperty('JSON')) {
    throw new ReferenceError('[judge] JSON global object not found');
  }

  // constructor usage errors
  if (_(element).isUndefined()) {
    throw new ReferenceError('[judge] No DOM element passed to constructor');
  }
  if (!judge.utils.isValidatable(element)) {
    throw new TypeError('[judge] Cannot construct new judge.Watcher instance from object of this type');
  }
  
  // convenience accessor
  var instance = this;

  // common instance properties
  this.element         = element;
  this.validators      = JSON.parse(this.element.getAttribute('data-validate'));
  this.defaultMessages = JSON.parse(this.element.form.getAttribute('data-error-messages'));
  
  // instance methods
  this.validate = function() {
    instance.errorMessages = [];
    var validators = instance.validators,
        validity   = true,
        messages   = [];
    _(validators).each(function(validator) {
      var options = validator.options;
      if (instance.element.value.length || options.allow_blank !== true) {
        var result = instance.validates()[validator.kind](options);
        if (!result.valid && result.hasOwnProperty('messages')) {
          validity = false;
          messages.push(result.messages);
        }
      }
    });
    return {
      valid: validity, 
      messages: _(messages).flatten()
    };
  };

};

// instance methods
judge.Watcher.prototype.validates = function() {
  var instance        = this,
      extendedMethods = judge.customValidators,
      methods         = {
        presence: function(options) {
          if (instance.element.value.length) {
            return { valid:true };
          } else{
            return { valid:false, messages:[options.message || instance.defaultMessages.blank] };
          }
        },
        
        length: function(options) {
          var msgs = [],
              length = instance.element.value.length,
              types = {
                minimum: { operator: '<',  message: 'too_short' },
                maximum: { operator: '>',  message: 'too_long' },
                is:      { operator: '!=', message: 'wrong_length' }
              };
          _(types).each(function(properties, type) {
            if (options.hasOwnProperty(type) && judge.utils.operate(length, properties.operator, options[type])) {
              var m = options[properties.message] || instance.defaultMessages[properties.message];
              msgs.push(judge.utils.countMsg(m, options[type]));
            }
          });
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },

        exclusion: function(options) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (_(stringIn).include(instance.element.value)) {
            return { valid:false, messages:[options.message || instance.defaultMessages.exclusion] };
          } else {
            return { valid:true };
          }
        },

        inclusion: function(options) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (!_(stringIn).include(instance.element.value)) {
            return { valid:false, messages:[options.message || instance.defaultMessages.inclusion] };
          } else {
            return { valid:true };
          }
        },

        numericality: function(options) {
          var operators = {
                greater_than: '>',
                greater_than_or_equal_to: '>=',
                equal_to: '==',
                less_than: '<',
                less_than_or_equal_to: '<='
              },
              msgs = [],
              value = instance.element.value,
              parsedValue = parseFloat(value); 

          if (isNaN(Number(value))) {
            msgs.push(options.message || instance.defaultMessages.not_a_number);
          } else {
            if (options.odd && judge.utils.isEven(parsedValue)) { msgs.push(instance.defaultMessages.odd); }
            if (options.even && judge.utils.isOdd(parsedValue)) { msgs.push(instance.defaultMessages.even); }
            if (options.only_integer && !judge.utils.isInt(parsedValue)) { msgs.push(instance.defaultMessages.not_an_integer); }
            _(operators).each(function(operator, key) {
              if (options.hasOwnProperty(key) && !judge.utils.operate(parsedValue, operators[key], parseFloat(options[key]))) {
                var m = options.message || instance.defaultMessages[key];
                msgs.push(judge.utils.countMsg(m, options[key]));
              }
            });
          }
          return msgs.length? { valid:false, messages:msgs } : { valid:true };
        },

        format: function(options) {
          var msgs  = [],
              value = instance.element.value;
          if (options.hasOwnProperty('with')) {
            var withReg = judge.utils.convertRegExp(options['with']);
            if (!withReg.test(value)) { msgs.push(options.message || instance.defaultMessages.invalid); }
          }
          if (options.hasOwnProperty('without')) {
            var withoutReg = judge.utils.convertRegExp(options.without);
            if (withoutReg.test(value)) { msgs.push(options.message || instance.defaultMessages.invalid); }
          }
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        }
      };
  return _.extend(methods, extendedMethods);
};

// static properties
judge.watched          = [];
judge.customValidators = {};

// static methods
judge.watch = function(element) {
  var elements = judge.utils.isCollection(element) ? element : [element];
  _(elements).each(function(element) {
    var watchedInstance = new judge.Watcher(element);
    var currentWatched = _(judge.watched).pluck('element');
    if (!_(currentWatched).include(element)) {
      judge.watched.push(watchedInstance);
    }
  });
  return judge.watched;
};

judge.unwatch = function(element) {
  var elements = judge.utils.isCollection(element) ? element : [element];
  judge.watched = _(judge.watched).reject(function(j) { return _(elements).include(j.element); });
  return judge.watched;
};

judge.validate = function(elements) {
  var results = [];
  elements = judge.utils.isCollection(elements) ? elements : judge.watched;
  _(elements).each(function(element) {
    var j = new judge.Watcher(element);
    results.push(j.validate());
  });
  return results;
};

// utils
judge.utils = {
  // determine whether object is a DOM element of the types that judge can work with
  isValidatable: function(object) {
    var type = judge.utils.getObjectString(object);
    return (
      type === "HTMLInputElement"    || 
      type === "HTMLTextAreaElement" || 
      type === "HTMLSelectElement"
    );
  },

  // a way of checking isArray but including NodeList
  isCollection: function(object) {
    var type = judge.utils.getObjectString(object);
    return (
      type === "Array" || type === "NodeList"
    );
  },

  // return object type as represented in Object.prototype.toString
  getObjectString: function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  },

  // (3, '<', 4) => '3 < 4' => true
  operate: function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  },

  // sub expected value into error message
  countMsg: function(message, count) { return message.replace(/\%\{count\}/, count); },

  // numerical helpers
  isInt: function(value) { return value === +value && value === (value|0); },
  isFloat: function(value) { return value === +value && value !== (value|0); },
  isEven: function(value) { return (value % 2 === 0) ? true : false; },
  isOdd: function(value) { return !judge.utils.isEven(value); },

  // convert ruby flag-first, string formatted RegExp into JS
  convertRegExp: function(string) {
    var p = string.slice(1, -1).split(':'),
        o = p.shift(),
        r = p.join(':');
    return new RegExp(r, judge.utils.convertFlags(o));
  },
  convertFlags: function(string) {
    var off = new RegExp('-'),
        multi = new RegExp('m');
    string = string.replace('?', '');
    if (off.test(string) || !multi.test(string)) {
      return '';
    } else {
      return 'm';
    }
  }
};

