(function($, window, document) {
  
  $.fn.extend({
    
    judge: function(eventType, userCallbacks) {
      
      eventType = eventType || 'keyup';
      callbacks = Judge.defaultCallbacks;
      $.extend(callbacks, userCallbacks);

      return this.each(function() {
        var element     = $(this),
            validations = $.parseJSON(element.attr('data-validate'));

        Judge.messages = $.parseJSON(element.closest('form').attr('data-error-messages'));

        element.bind(eventType, function() {
          var errors = Judge.getErrors(element.val(), validations);
          callbacks[errors.length ? 'failure' : 'success'].call(element, errors);
        });

      });

    }

  });


  var Judge = {

    getErrors: function(value, validations) {
      var errors = [];
      $.each(validations, function(i, validation) {
        if (value.length || !validation.options.allow_blank) { // handle :allow_blank => true
          var result = Judge.validators[validation.kind](value, validation.options);
          if (result) errors.push.apply(errors, result);
        };
      });
      return errors;
    },
    
    validators: {

      presence: function(value, options) {
        return value.length ? false : [options.message || Judge.messages.blank];
      },

      length: function(value, options) {
        var msgs = [];
        $.each(options, function(option, number) {
          switch(option) {
            case 'minimum':
              if (value.length < number)
                msgs.push(Judge.utils.cntMsg(options.too_short, number) || Judge.utils.cntMsg(Judge.messages.too_short, number));
              break;
            case 'maximum':
              if (value.length > number)
                msgs.push(Judge.utils.cntMsg(options.too_long, number) || Judge.utils.cntMsg(Judge.messages.too_long, number));
              break;
            case 'is':
              if (value.length != number)
                msgs.push(Judge.utils.cntMsg(options.wrong_length, number) || Judge.utils.cntMsg(Judge.messages.wrong_length, number));
              break;
          };
        });
        return msgs.length ? msgs : false;
      },

      exclusion: function(value, options) {
        return $.inArray(value, Judge.utils.stringedArray(options.in)) == -1 ? false : [options.message || Judge.messages.exclusion];
      },

      inclusion: function(value, options) {
        return $.inArray(value, Judge.utils.stringedArray(options.in)) > -1 ? false : [options.message || Judge.messages.inclusion];
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
          msgs.push(options.message || Judge.messages.not_a_number);
        } else {
          if (options.odd && Judge.utils.isEven(parsedValue)) msgs.push(Judge.messages.odd);
          if (options.even && Judge.utils.isOdd(parsedValue)) msgs.push(Judge.messages.even);
          if (options.only_integer && !Judge.utils.isInt(parsedValue)) msgs.push(Judge.messages.not_an_integer);
          $.each(operators, function(key, operator) {
            if (key in options && !Judge.utils.check(parsedValue, operators[key], options[key]))
              msgs.push(options.message || Judge.utils.cntMsg(Judge.messages[key], options[key]));
          });
        };
        return msgs.length? msgs : false;
      },

      format: function(value, options) {
        var msgs = [];
        if ('with' in options) {
          var withReg = Judge.utils.convertRegExp(options.with);
          console.log(withReg);
          if (!withReg.test(value)) msgs.push(options.message || Judge.messages.invalid);
        };
        if ('without' in options) {
          var withoutReg = Judge.utils.convertRegExp(options.without);
          console.log(withoutReg)
          if (withoutReg.test(value)) msgs.push(options.message || Judge.messages.invalid);
        };
        return msgs.length? msgs : false;
      }

    },

    utils: {

      cntMsg: function(message, number) {
        return (message === undefined) ? false : message.replace(/%{count}/, number);
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
        return new RegExp(r, Judge.utils.convertOptions(o));
      },
      convertOptions: function(string) {
        var mappedOpts = {
          i: 'i',
          m: 'm'
        };
        string = string.replace('?', '');
        return 'g'; // return converted regexp options here
      }

    },

    defaultCallbacks: {
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
  
}(jQuery, this, document));

