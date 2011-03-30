(function($, window, document) {
  
  $.fn.extend({
    
    judge: function(eventType, userCallbacks) {
      
      eventType = eventType || 'keyup';
      callbacks = Judge._defaultCallbacks;
      $.extend(callbacks, userCallbacks);

      return this.each(function() {
        var element     = $(this),
            validations = $.parseJSON(element.attr('data-validate'));

        Judge.DefaultErrors = $.parseJSON(element.closest('form').attr('data-error-messages'));

        element.bind(eventType, function() {
          var errors = Judge._getErrors(element.val(), validations);
          callbacks[errors.length ? 'failure' : 'success'].call(element, errors);
        });

      });

    }

  });

}(jQuery, this, document));


var Judge = {
  
  Validators: {

    presence: function(value, options) {
      return value.length ? false : [options.message || Judge.DefaultErrors.blank];
    },

    length: function(value, options) {
      var msgs = [];
      $.each(options, function(option, number) {
        switch(option) {
          case 'minimum':
            if (value.length < number)
              msgs.push(Judge.Utilities.messageWithCount((('too_short' in options) ? options.too_short : Judge.DefaultErrors.too_short), number));
            break;
          case 'maximum':
            if (value.length > number)
              msgs.push(Judge.Utilities.messageWithCount((('too_long' in options) ? options.too_long : Judge.DefaultErrors.too_long), number));
            break;
          case 'is':
            if (value.length != number)
              msgs.push(Judge.Utilities.messageWithCount((('wrong_length' in options) ? options.wrong_length : Judge.DefaultErrors.wrong_length), number));
            break;
        };
      });
      return msgs.length ? msgs : false;
    },

    exclusion: function(value, options) {
      return $.inArray(value, Judge.Utilities.stringedArray(options.in)) == -1 ? false : [options.message || Judge.DefaultErrors.exclusion];
    },

    inclusion: function(value, options) {
      return $.inArray(value, Judge.Utilities.stringedArray(options.in)) > -1 ? false : [options.message || Judge.DefaultErrors.inclusion];
    },

    numericality: function(value, options) {
      var operators = {
            greater_than: '>',
            greater_than_or_equal_to: '>=',
            equal_to: '==',
            less_than: '<',
            less_than_or_equal_to: '<=',
          },
          msgs = [],
          parsedValue = parseFloat(value); // this, not the raw value, gets eval'd

      if (isNaN(Number(value))) {
        msgs.push(options.message || Judge.DefaultErrors.not_a_number);
      } else {
        if (options.odd && Judge.Utilities.isEven(parsedValue)) msgs.push(Judge.DefaultErrors.odd);
        if (options.even && Judge.Utilities.isOdd(parsedValue)) msgs.push(Judge.DefaultErrors.even);
        if (options.only_integer && !Judge.Utilities.isInt(parsedValue)) msgs.push(Judge.DefaultErrors.not_an_integer);
        $.each(operators, function(key, operator) {
          if (key in options && !Judge.Utilities.check(parsedValue, operators[key], options[key]))
            msgs.push(options.message || Judge.Utilities.messageWithCount(Judge.DefaultErrors[key], options[key]));
        });
      };
      return msgs.length? msgs : false;
    },

    format: function(value, options) {
      var msgs = [];
      if ('with' in options) {
        var withReg = Judge.Utilities.convertRegExp(options.with);
        if (!withReg.test(value)) msgs.push(options.message || Judge.DefaultErrors.invalid);
      };
      if ('without' in options) {
        var withoutReg = Judge.Utilities.convertRegExp(options.without);
        console.log(withoutReg)
        if (withoutReg.test(value)) msgs.push(options.message || Judge.DefaultErrors.invalid);
      };
      return msgs.length? msgs : false;
    }

  },

  Utilities: {

    messageWithCount: function(message, number) {
      return message.replace(/%{count}/, number);
    },
    isInt: function(value) { return value === +value && value === (value|0); },
    isFloat: function(value) { return value === +value && value !== (value|0); },
    isEven: function(value) { return (value % 2 == 0) ? true : false; },
    isOdd: function(value) { return (value % 2 == 0) ? false : true; },
    check: function(input, operator, validInput) { return eval(input+' '+operator+' '+validInput); },
    stringedArray: function(array) { return $.map(array, function(i) { return i.toString(); }); },
    convertRegExp: function(string) {
      var p = string.slice(1, -1).split(':'),
          o = p.shift(),
          r = p.join(':');
      return new RegExp(r, Judge.Utilities.convertOptions(o));
    },
    convertOptions: function(string) {
      var off = new RegExp('-'),
          multi = new RegExp('m');
      string = string.replace('?', '');
      if (off.test(string) || !multi.test(string)) {
        return '';
      } else {
        return 'm';
      };
    }

  },

  _getErrors: function(value, validations) {
    var errors = [];
    $.each(validations, function(i, validation) {
      if (value.length || !validation.options.allow_blank) { // handle :allow_blank => true
        var result = Judge.Validators[validation.kind](value, validation.options);
        if (result) errors.push.apply(errors, result);
      };
    });
    return errors;
  },

  _defaultCallbacks: {
    success: function() {
      this.css({ border: '1px solid green' });
       $('label[for='+this.attr('id')+'] span.errors').empty().remove();
    },
    failure: function(errors) {
      this.css({ border: '1px solid red' });
      var label = $('label[for='+this.attr('id')+']'),
          message = label.find('span.errors'),
          errors = ' '+errors.join(',');
      message.length ? message.html(errors) : label.append($('<span/>').addClass('errors').css({ color: 'red' }).html(errors));
    }  
  }

};




