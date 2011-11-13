// This is the JavaScript part of Judge, a client-side validation gem for Rails 3.
// You can find a guide and some more traditional API documentation at <http://joecorcoran.github.com/judge/>.
// Hopefully this page will help you understand what's happening under the hood.

/* http://raw.github.com/joecorcoran/judge/master/LICENSE.txt */

/*jshint curly: true, evil: true, newcap: true, noarg: true, strict: false */
/*global _: false, JSON: false */  

// The judge namespace.
var judge = judge || {};

// A judge.Watcher is a DOM element wrapper that judge uses to store validation info and instance methods.
judge.Watcher = function (element) {

  // Throw dependency errors.
  if (typeof window._ === 'undefined') {
    throw {
      name: 'ReferenceError',
      message: '[judge][dependency] Underscore.js not found'
    };
  }
  if (_(window.JSON).isUndefined()) {
    throw {
      name: 'ReferenceError',
      message: '[judge][dependency] JSON global object not found'
    };
  }

  // Throw some constructor usage errors.
  if (_(element).isUndefined()) {
    throw {
      name: 'ReferenceError',
      message: '[judge][constructor] No DOM element passed to constructor'
    };
  }

  if (element.getAttribute('data-validate') === null) {
    throw {
      name: 'ReferenceError',
      message: '[judge][constructor] Cannot construct Watcher for this element, use judge form builders'
    };
  }

  // Convenient access to this Watcher.
  var watcher = this;

  // Watcher instance properties.
  this.element         = element;
  this.validators      = JSON.parse(this.element.getAttribute('data-validate'));
  
  // The `validate` instance method returns the validity of the watched element, 
  // represented as an object containing the element itself and some validity information.
  this.validate = function() {
    watcher.errorMessages = [];
    var validators = watcher.validators,
        validity   = true,
        messages   = [];
    _(validators).each(function(validator) {
      var options = validator.options,
          msgs    = validator.messages;
      if (watcher.element.value.length || options.allow_blank !== true) {
        var result = watcher.validates()[validator.kind](options, msgs);
        if (!result.valid && result.hasOwnProperty('messages')) {
          validity = false;
          messages.push(result.messages);
        }
      }
    });
    return {
      valid: validity, 
      messages: _(messages).flatten(),
      element: watcher.element
    };
  };

};

// Watcher prototype methods.
judge.Watcher.prototype.validates = function() {
  var watcher         = this,
      extendedMethods = judge.customValidators,
      methods         = {

        // Presence validator ported as closely as possible
        // from [ActiveModel::Validations::PresenceValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/PresenceValidator.html).
        presence: function(options, messages) {
          if (watcher.element.value.length) {
            return { valid:true };
          } else{
            return { valid:false, messages:[messages.blank] };
          }
        },
        
        // Length validator ported as closely as possible
        // from [ActiveModel::Validations::LengthValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/LengthValidator.html).
        length: function(options, messages) {
          var msgs = [],
              length = watcher.element.value.length,
              types = {
                minimum: { operator: '<',  message: 'too_short' },
                maximum: { operator: '>',  message: 'too_long' },
                is:      { operator: '!=', message: 'wrong_length' }
              };
          _(types).each(function(properties, type) {
            var invalid = judge.utils.operate(length, properties.operator, options[type]);
            if (options.hasOwnProperty(type) && invalid) {
              msgs.push(messages[properties.message]);
            }
          });
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Exclusion validator ported as closely as possible
        // from [ActiveModel::Validations::ExclusionValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/ExclusionValidator.html).
        exclusion: function(options, messages) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (_(stringIn).include(watcher.element.value)) {
            return {
              valid:false,
              messages:[messages.exclusion]
            };
          } else {
            return { valid:true };
          }
        },
        
        // Inclusion validator ported as closely as possible
        // from [ActiveModel::Validations::InclusionValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/InclusionValidator.html).
        inclusion: function(options, messages) {
          var stringIn = _(options['in']).map(function(o) { return o.toString(); });
          if (!_(stringIn).include(watcher.element.value)) {
            return {
              valid:false,
              messages:[messages.inclusion]
            };
          } else {
            return { valid:true };
          }
        },
        
        // Numericality validator ported as closely as possible
        // from [ActiveModel::Validations::NumericalityValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/NumericalityValidator.html).
        numericality: function(options, messages) {
          var operators = {
                greater_than: '>',
                greater_than_or_equal_to: '>=',
                equal_to: '==',
                less_than: '<',
                less_than_or_equal_to: '<='
              },
              msgs = [],
              value = watcher.element.value,
              parsedValue = parseFloat(value, 10); 

          if (isNaN(Number(value))) {
            msgs.push(messages.not_a_number);
          } else {
            if (options.odd && judge.utils.isEven(parsedValue)) {
              msgs.push(messages.odd);
            }
            if (options.even && judge.utils.isOdd(parsedValue)) {
              msgs.push(messages.even);
            }
            if (options.only_integer && !judge.utils.isInt(parsedValue)) {
              msgs.push(messages.not_an_integer);
            }
            _(operators).each(function(operator, key) {
              var valid = judge.utils.operate(parsedValue, operators[key], parseFloat(options[key], 10));
              if (options.hasOwnProperty(key) && !valid) {
                msgs.push(messages[key]);
              }
            });
          }
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Format validator ported as closely as possible
        // from [ActiveModel::Validations::FormatValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/FormatValidator.html).
        format: function(options, messages) {
          var msgs  = [],
              value = watcher.element.value;
          if (options.hasOwnProperty('with')) {
            var withReg = judge.utils.convertRegExp(options['with']);
            if (!withReg.test(value)) {
              msgs.push(messages.invalid);
            }
          }
          if (options.hasOwnProperty('without')) {
            var withoutReg = judge.utils.convertRegExp(options.without);
            if (withoutReg.test(value)) {
              msgs.push(messages.invalid);
            }
          }
          return msgs.length ? { valid:false, messages:msgs } : { valid:true };
        },
        
        // Acceptance validator ported as closely as possible
        // from [ActiveModel::Validations::AcceptanceValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/AcceptanceValidator.html).
        acceptance: function(options, messages) {
          if (watcher.element.checked === true) {
            return { valid:true };
          } else {
            return {
              valid:false,
              messages:[messages.accepted]
            };
          }
        },
        
        // Confirmation validator ported as closely as possible
        // from [ActiveModel::Validations::ConfirmationValidator](http://api.rubyonrails.org/classes/ActiveModel/Validations/ConfirmationValidator.html).
        confirmation: function(options, messages) {
          var id       = watcher.element.getAttribute('id'),
              confId   = id + '_confirmation',
              confElem = document.getElementById(confId);
          if (watcher.element.value === confElem.value) {
            return { valid:true };
          } else {
            return {
              valid:false,
              messages:[messages.confirmation]
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

    // Stores watcher(s) for element(s) against a user defined key.
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

    // Removes stored watcher(s).
    remove: function(key, element) {
      if (!store.hasOwnProperty(key)) {
        return null;
      }
      var elements = judge.utils.isCollection(element) ? element : [element];
      store[key] = _(store[key]).reject(function(j) { return _(elements).include(j.element); });
      if (store[key].length === 0) {
        delete store[key];
      }
      return store[key];
    },

    // Returns the entire store object, or an array of watchers stored against
    // the given key.
    get: function(key) {
      if (_(key).isUndefined()) { return store; }
      return store.hasOwnProperty(key) ? store[key] : null;
    },

    // Returns the entire store object with watchers converted to elements, 
    // or all DOM elements stored within all watchers stored against the given key.
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

    // Shortcut for `judge.validate(judge.store.getDOM(key));`.
    // Returns null if no stored elements are found for the given key.
    validate: function(key) {
      var elements = judge.store.getDOM(key);
      return (key && !_(elements).isNull()) ? judge.validate(elements) : null;
    },

    // Wipes the entire store object, or wipes all watchers stored against 
    // the given key.
    clear: function(key) {
      if (_(key).isUndefined()) {
        store = {};
      } else {
        if (!store.hasOwnProperty(key)) { return null; }
        delete store[key];
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

  // A way of checking isArray, but including weird object types that are returned from collection queries.
  isCollection: function(object) {
    var type  = judge.utils.getObjectString(object),
        types = [
          'Array',
          'NodeList',
          'StaticNodeList',
          'HTMLCollection',
          'HTMLFormElement',
          'HTMLAllCollection'
        ];
    return _(types).include(type);
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

  // Some nifty numerical helpers.
  isInt: function(value) { return value === +value && value === (value|0); },
  isFloat: function(value) { return value === +value && value !== (value|0); },
  isEven: function(value) { return (value % 2 === 0) ? true : false; },
  isOdd: function(value) { return !judge.utils.isEven(value); },

  // Converts a Ruby regular expression, given as a string, into JavaScript.
  // This is rudimentary at best, as there are many, many differences between Ruby
  // and JavaScript when it comes to regexp-fu. Basically, if you validate your records
  // using complex regular expressions AND you hope that this will "just work"
  // on the client-side too&hellip; you are going to be pretty disappointed.
  // If you know of a better way (or an existing library) to convert regular expressions 
  // from Ruby to JavaScript, I would really love to hear from you.
  convertRegExp: function(string) {
    var p = string.slice(1, -1).split(':'),
        o = p.shift(),
        r = p.join(':').replace(/\\\\/g, '\\');
    return new RegExp(r, judge.utils.convertFlags(o));
  },
  convertFlags: function(string) {
    var off    = new RegExp('-'),
        multi  = new RegExp('m');
    string = string.replace('?', '');
    if (off.test(string) || !multi.test(string)) {
      return '';
    } else {
      return 'm';
    }
  }
};
