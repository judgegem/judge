// constructor
var Judge = function(element) {
  
  // dependency errors
  if (!window.hasOwnProperty('_')) {
    throw new ReferenceError('[Judge] Underscore.js not found');
  };
  if (!window.hasOwnProperty('JSON')) {
    throw new ReferenceError('[Judge] JSON global object not found');
  };

  // constructor usage errors
  if (_(element).isUndefined()) {
    throw new ReferenceError('[Judge] No DOM element passed to constructor');
  };
  if (!Judge.utils.isValidatable(element)) {
    throw new TypeError('[Judge] Cannot construct new Judge instance from object of this type');
  };
  
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
        var result = instance.validates[validator.kind](options);
        if (!result.valid && result.hasOwnProperty('messages')) {
          validity = false;
          messages.push(result.messages);
        };
      };
    });
    return {
      valid: validity, 
      messages: _(messages).flatten()
    };
  };

  // instance methods (validation)
  this.validates = {
    presence: function(options) {
      if (instance.element.value.length) {
        return { valid:true };
      } else{
        return { valid:false, messages:[options.message || instance.defaultMessages.blank] };
      };
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
        if (type in options && Judge.utils.operate(length, properties.operator, options[type])) {
          var m = options[properties.message] || instance.defaultMessages[properties.message];
          msgs.push(Judge.utils.countMsg(m, options[type]));
        };
      });
      return msgs.length ? { valid:false, messages:msgs } : { valid:true };
    },

    exclusion: function(options) {
      var stringIn = _(options.in).map(function(o) { return o.toString(); });
      if (_(stringIn).include(instance.element.value)) {
        return { valid:false, messages:[options.message || instance.defaultMessages.exclusion] };
      } else {
        return { valid:true };
      };
    },

    inclusion: function(options) {
      var stringIn = _(options.in).map(function(o) { return o.toString(); });
      if (!_(stringIn).include(instance.element.value)) {
        return { valid:false, messages:[options.message || instance.defaultMessages.inclusion] };
      } else {
        return { valid:true };
      };
    },

    numericality: function(options) {
      var operators = {
            greater_than: '>',
            greater_than_or_equal_to: '>=',
            equal_to: '==',
            less_than: '<',
            less_than_or_equal_to: '<=',
          },
          msgs = [],
          value = instance.element.value,
          parsedValue = parseFloat(value); 

      if (isNaN(Number(value))) {
        msgs.push(options.message || instance.defaultMessages.not_a_number);
      } else {
        if (options.odd && Judge.utils.isEven(parsedValue)) { msgs.push(instance.defaultMessages.odd) };
        if (options.even && Judge.utils.isOdd(parsedValue)) { msgs.push(instance.defaultMessages.even) };
        if (options.only_integer && !Judge.utils.isInt(parsedValue)) { msgs.push(instance.defaultMessages.not_an_integer) };
        _(operators).each(function(operator, key) {
          if (key in options && !Judge.utils.operate(parsedValue, operators[key], parseFloat(options[key]))) {
            var m = options.message || instance.defaultMessages[key];
            msgs.push(Judge.utils.countMsg(m, options[key]));
          };
        });
      };
      return msgs.length? { valid:false, messages:msgs } : { valid:true };
    },

    format: function(options) {
      var msgs  = [],
          value = instance.element.value;
      if ('with' in options) {
        var withReg = Judge.utils.convertRegExp(options.with);
        if (!withReg.test(value)) msgs.push(options.message || instance.defaultMessages.invalid);
      };
      if ('without' in options) {
        var withoutReg = Judge.utils.convertRegExp(options.without);
        if (withoutReg.test(value)) msgs.push(options.message || instance.defaultMessages.invalid);
      };
      return msgs.length ? { valid:false, messages:msgs } : { valid:true };
    }

  };

};

// static properties
Judge.watched = [];

// static methods
Judge.watch = function(element) {
  elements =  Judge.utils.isCollection(element) ? element : [element];
  _(elements).each(function(element) {
    var watchedInstance = new Judge(element);
    var currentWatched = _(Judge.watched).pluck('element');
    if (!_(currentWatched).include(element)) {
      Judge.watched.push(watchedInstance);
    };
  });
  return Judge.watched;
};

Judge.unwatch = function(element) {
  Judge.watched = _(Judge.watched).reject(function(j) { return j.element === element });
  return Judge.watched;
};

Judge.validate = function(elements) {
  var results = [];
  elements = Judge.utils.isCollection(elements) ? elements : Judge.watched;
  _(elements).each(function(element) {
    var j = new Judge(element);
    results.push(j.validate());
  });
  return results;
};

// utils
Judge.utils = {
  // determine whether object is a DOM element of the types that Judge can work with
  isValidatable: function(object) {
    var type = Judge.utils.getObjectString(object);
    return (
      type === "HTMLInputElement"    || 
      type === "HTMLTextAreaElement" || 
      type === "HTMLSelectElement"
    );
  },
  // a way of checking isArray but including NodeList
  isCollection: function(object) {
    var type = Judge.utils.getObjectString(object);
    return (
      type === "Array" || type === "NodeList"
    )
  },
  // return object type as represented in Object.prototype.toString
  getObjectString: function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  },
  operate: function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  },
  countMsg: function(message, count) { return message.replace(/%{count}/, count); },
  isInt: function(value) { return value === +value && value === (value|0); },
  isFloat: function(value) { return value === +value && value !== (value|0); },
  isEven: function(value) { return (value % 2 == 0) ? true : false; },
  isOdd: function(value) { return !Judge.utils.isEven(value); },
  convertRegExp: function(string) {
    var p = string.slice(1, -1).split(':'),
        o = p.shift(),
        r = p.join(':');
    return new RegExp(r, Judge.utils.convertFlags(o));
  },
  convertFlags: function(string) {
    var off = new RegExp('-'),
        multi = new RegExp('m');
    string = string.replace('?', '');
    if (off.test(string) || !multi.test(string)) {
      return '';
    } else {
      return 'm';
    };
  }
};

