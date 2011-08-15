// This is the JavaScript part of Judge, a client-side validation gem for Rails 3.
// You can find a guide and some more traditional API documentation at <http://joecorcoran.github.com/judge/>.
// Hopefully this page will help you understand what's happening under the hood.

/*jshint curly: true, evil: true, newcap: true, noarg: true */
/*global _: false, JSON: false */  

// The judge namespace.
var judge = judge || {};

// A judge.Watcher is a DOM element wrapper that judge uses to store validation info and instance methods.
judge.Watcher = function (element) {
  
  // Throw dependency errors.
  if (!window.hasOwnProperty('_')) {
    throw new ReferenceError('[judge] Underscore.js not found');
  }
  if (!window.hasOwnProperty('JSON')) {
    throw new ReferenceError('[judge] JSON global object not found');
  }

  // Throw some constructor usage errors.
  if (_(element).isUndefined()) {
    throw new ReferenceError('[judge] No DOM element passed to constructor');
  }
  if (!judge.utils.isValidatable(element)) {
    throw new TypeError('[judge] Cannot construct new Watcher for object of this type');
  }
  if (element.getAttribute('data-validate') === null) {
    throw new ReferenceError('[judge] Cannot construct Watcher for this element, use judge form builders');
  }
  if (element.form.getAttribute('data-error-messages') === null) {
    throw new ReferenceError('[judge] Parent form was not created using judge form helper, please amend');
  }


  // Convenient access to this Watcher.
  var instance = this;

  // Watcher instance properties.
  this.element         = element;
  this.validators      = JSON.parse(this.element.getAttribute('data-validate'));
  this.defaultMessages = JSON.parse(this.element.form.getAttribute('data-error-messages'));
  
  // The `validate` instance method returns the validity of the watched element, 
  // represented as an object containing the element itself and some validity information.
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
      messages: _(messages).flatten(),
      element: instance.element
    };
  };

};

// Watcher prototype methods.
judge.Watcher.prototype.validates = function() {
  var instance        = this,
      extendedMethods = judge.customValidators,
      methods         = {

        // Presence validator ported as closely as possible
        // from [ActiveModel::Validations::PresenceValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/PresenceValidator.html).
        presence: function(options) {
          if (instance.element.value.length) {
            return { valid:true };
          } else{
            return { valid:false, messages:[options.message || instance.defaultMessages.blank] };
          }
        },
        
        // Length validator ported as closely as possible
        // from [ActiveModel::Validations::LengthValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/LengthValidator.html).
        length: function(options) {
          var msgs = [],
              length = instance.element.value.length,
              types = {
                minimum: { operator: '<',  message: 'too_short' },
                maximum: { operator: '>',  message: 'too_long' },
                is:      { operator: '!=', message: 'wrong_length' }
              };
          _(types).each(function(properties, type) {
            var invalid = judge.utils.operate(length, properties.operator, options[type]);
            if (options.hasOwnProperty(type) && invalid) {
              var m = options[properties.message] || instance.defaultMessages[properties.message];
              msgs.push(judge.utils.countMsg(m, options[type]));
            }
          });
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Exclusion validator ported as closely as possible
        // from [ActiveModel::Validations::ExclusionValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/ExclusionValidator.html).
        exclusion: function(options) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (_(stringIn).include(instance.element.value)) {
            return {
              valid:false,
              messages:[options.message || instance.defaultMessages.exclusion]
            };
          } else {
            return { valid:true };
          }
        },
        
        // Inclusion validator ported as closely as possible
        // from [ActiveModel::Validations::InclusionValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/InclusionValidator.html).
        inclusion: function(options) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (!_(stringIn).include(instance.element.value)) {
            return {
              valid:false,
              messages:[options.message || instance.defaultMessages.inclusion]
            };
          } else {
            return { valid:true };
          }
        },
        
        // Numericality validator ported as closely as possible
        // from [ActiveModel::Validations::NumericalityValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/NumericalityValidator.html).
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
              parsedValue = parseFloat(value, 10); 

          if (isNaN(Number(value))) {
            msgs.push(options.message || instance.defaultMessages.not_a_number);
          } else {
            if (options.odd && judge.utils.isEven(parsedValue)) {
              msgs.push(instance.defaultMessages.odd);
            }
            if (options.even && judge.utils.isOdd(parsedValue)) {
              msgs.push(instance.defaultMessages.even);
            }
            if (options.only_integer && !judge.utils.isInt(parsedValue)) {
              msgs.push(instance.defaultMessages.not_an_integer);
            }
            _(operators).each(function(operator, key) {
              var valid = judge.utils.operate(parsedValue, operators[key], parseFloat(options[key], 10));
              if (options.hasOwnProperty(key) && !valid) {
                var m = options.message || instance.defaultMessages[key];
                msgs.push(judge.utils.countMsg(m, options[key]));
              }
            });
          }
          return msgs.length? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Format validator ported as closely as possible
        // from [ActiveModel::Validations::FormatValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/FormatValidator.html).
        format: function(options) {
          var msgs  = [],
              value = instance.element.value;
          if (options.hasOwnProperty('with')) {
            var withReg = judge.utils.convertRegExp(options['with']);
            if (!withReg.test(value)) {
              msgs.push(options.message || instance.defaultMessages.invalid);
            }
          }
          if (options.hasOwnProperty('without')) {
            var withoutReg = judge.utils.convertRegExp(options.without);
            if (withoutReg.test(value)) {
              msgs.push(options.message || instance.defaultMessages.invalid);
            }
          }
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Acceptance validator ported as closely as possible
        // from [ActiveModel::Validations::AcceptanceValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/AcceptanceValidator.html).
        acceptance: function(options) {
          if (instance.element.checked === true) {
            return { valid:true };
          } else {
            return {
              valid:false,
              messages:[options.message || instance.defaultMessages.accepted]
            };
          }
        },
        
        // Confirmation validator ported as closely as possible
        // from [ActiveModel::Validations::ConfirmationValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/ConfirmationValidator.html).
        confirmation: function(options) {
          var id       = instance.element.getAttribute('id'),
              confId   = id + '_confirmation',
              confElem = document.getElementById(confId);
          if (instance.element.value === confElem.value) {
            return { valid:true };
          } else {
            return {
              valid:false,
              messages:[options.message || instance.defaultMessages.confirmation]
            };
          }
        }
      };
  // Return all validation methods, including those found in judge.customValidators.
  // If you name a custom validation method the same as a default one, for example
  //   `judge.customValidators.presence = function() {};`
  // then the custom method _will overwrite_ the default one, so be careful!
  return _.extend(methods, extendedMethods);
};

// This object should contain any judge validation methods
// that correspond to custom validators used in the model.
judge.customValidators = {};

// The judge store is now open :)
judge.store = (function() {
  var store   = {};

  return {

    // Stores a Watcher for an element against a user defined key.
    save: function(key, element) {
      var elements = judge.utils.isCollection(element) ? element : [element];
      _(elements).each(function(element) {
        if (!store.hasOwnProperty(key)) { store[key] = []; }
        var watchedInstance = new judge.Watcher(element),
            currentStored   = _(store[key]).pluck('element');
        if (!_(currentStored).include(element)) {
          store[key].push(watchedInstance);
        }
      });
      return store;
    },

    // Removes an individual stored Watcher.
    remove: function(key, element) {
      if (!store.hasOwnProperty(key)) {
        return null;
      }
      var elements = judge.utils.isCollection(element) ? element : [element];
      store[key] = _(store[key]).reject(function(j) { return _(elements).include(j.element); });
      return store;
    },

    // Returns the entire store object, or an array of Watchers stored against
    // the given key.
    get: function(key) {
      if (_(key).isUndefined()) { return store; }
      return store.hasOwnProperty(key) ? store[key] : null;
    },

    // Returns the entire store object with Watchers converted to elements, 
    // or all DOM elements stored within all Watchers stored against the given key.
    getDOM: function(key) {
      if (_(key).isUndefined()) {
        var convertedStore = {};
        _(store).each(function(array, key) {
          convertedStore[key] = _(array).pluck('element');
        });
        return convertedStore;
      }
      return store.hasOwnProperty(key) ? _(store[key]).pluck('element') : null;
    },

    // Wipes the entire store object, or wipes all Watchers stored against 
    // the given key.
    clear: function(key) {
      if (_(key).isUndefined()) {
        store = {};
      } else {
        if (!store.hasOwnProperty(key)) { return null; }
        store[key] = [];
      }
      return store;
    }

  };
}());

// Validate all given element(s) without storing. Watcher creation is handled for you,
// but the created Watchers will not be returned, so it's less flexible.
judge.validate = function(elements) {
  var results = [];
  elements = judge.utils.isCollection(elements) ? elements : [elements];
  _(elements).each(function(element) {
    var j = new judge.Watcher(element);
    results.push(j.validate());
  });
  return results;
};

// The obligatory utilities.
judge.utils = {
  
  // Determines whether an object is a DOM element of the types that judge can work with.
  isValidatable: function(object) {
    var type = judge.utils.getObjectString(object);
    return (
      type === "HTMLInputElement"    || 
      type === "HTMLTextAreaElement" || 
      type === "HTMLSelectElement"
    );
  },

  // A way of checking isArray but including NodeList.
  isCollection: function(object) {
    var type = judge.utils.getObjectString(object);
    return (
      type === "Array" || type === "NodeList"
    );
  },

  // Returns the object type as represented in `Object.prototype.toString`.
  getObjectString: function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  },

  // OMG! How can you use eval, you monster! It's totally evil!
  // (It's used here for stuff like `(3, '<', 4) => '3 < 4' => true`.)
  operate: function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  },

  // Sub the expected value into an error message.
  countMsg: function(message, count) { return message.replace(/\%\{count\}/, count); },

  // Some nifty numerical helpers.
  isInt: function(value) { return value === +value && value === (value|0); },
  isFloat: function(value) { return value === +value && value !== (value|0); },
  isEven: function(value) { return (value % 2 === 0) ? true : false; },
  isOdd: function(value) { return !judge.utils.isEven(value); },

  // Converts a ruby flag-first formatted regular expression, given as a string, into JavaScript.
  // This is rudimentary at best, as there are many, many differences between Ruby
  // and JavaScript when it comes to regexp-fu. Basically, if you validate your records
  // using complex regular expressions AND you hope that this will "just work"
  // on the client-side too&hellip; you are going to be pretty disappointed.
  convertRegExp: function(string) {
    var p = string.slice(1, -1).split(':'),
        o = p.shift(),
        r = p.join(':').replace(/\\\\/, '\\');
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

