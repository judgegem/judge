var Judge = function(element) {

  if (!window.hasOwnProperty('_')) {
    throw new ReferenceError('[Judge] Underscore.js not found');
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

  // instance validation methods
  this.validates = {
    presence: function(options) {
      return (instance.element.value.length) ? { valid:true } : { valid:false, messages:[options.message || instance.defaultMessages.blank] };
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
          msgs.push(options[properties.message] || instance.defaultMessages[properties.message]);
        };
      });
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
  isValidatable: function(object) {
    var type = Judge.utils.getObjectString(object);
    return (
      type === "HTMLInputElement"    || 
      type === "HTMLTextAreaElement" || 
      type === "HTMLSelectElement"
    );
  },
  isCollection: function(object) {
    var type = Judge.utils.getObjectString(object);
    return (
      type === "Array" || type === "NodeList"
    )
  },
  getObjectString: function(object) {
    var string = Object.prototype.toString.call(object);
    return string.replace(/\[|\]/g, '').split(' ')[1];
  },
  operate: function(input, operator, validInput) {
    return eval(input+' '+operator+' '+validInput);
  }
};

