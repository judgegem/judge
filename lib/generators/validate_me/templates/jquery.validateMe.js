(function($, window, document) {
  
  $.fn.extend({
    
    validate: function(eventType, callbacks) {
      
      eventType = eventType || 'keyup';
      callbacks = $.extend(VM.defaultCallbacks, callbacks);

      return this.each(function() {
        var element     = $(this),
            validations = $.parseJSON(element.attr('data-validate'));

        VM.messages = $.parseJSON(element.closest('form').attr('data-error-messages'));

        element.bind(eventType, function() {
          var errors = VM.getErrors(element.val(), validations);
          callbacks[errors.length ? 'failure' : 'success'].call(element, errors);
        });

      });

    }

  });


  var VM = {

    getErrors: function(value, validations) {
      var errors = [];
      $.each(validations, function(i, validation) {
        if (value.length || !validation.options.allow_nil) { // handle :allow_nil => true
          console.log(value.length);
          var result = VM.validators[validation.kind](value, validation.options);
          if (result) errors.push(result);
        };
      });
      return errors;
    },
    
    validators: {

      presence: function(value, options) {
        return value.length ? false : [options.message || VM.messages.blank];
      },

      length: function(value, options) {
        var msgs = [];
        $.each(options, function(option, number) {
          switch(option) {
            case 'minimum':
              if (value.length < number)
                msgs.push(VM.utils.cntMsg(options.too_short, number) || VM.utils.cntMsg(VM.messages.too_short, number));
              break;
            case 'maximum':
              if (value.length > number)
                msgs.push(VM.utils.cntMsg(options.too_long, number) || VM.utils.cntMsg(VM.messages.too_long, number));
              break;
            case 'is':
              if (value.length != number)
                msgs.push(VM.utils.cntMsg(options.wrong_length, number) || VM.utils.cntMsg(VM.messages.wrong_length, number));
              break;
          };
        });
        return msgs.length ? msgs : false;
      },

      exclusion: function(value, options) {
        return $.inArray(value, VM.utils.stringedArray(options.in)) == -1 ? false : [options.message || VM.messages.exclusion];
      },

      inclusion: function(value, options) {
        return $.inArray(value, VM.utils.stringedArray(options.in)) > -1 ? false : [options.message || VM.messages.inclusion];
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
          msgs.push(options.message || VM.messages.not_a_number);
        } else {
          if (options.odd && VM.utils.isEven(parsedValue)) msgs.push(VM.messages.odd);
          if (options.even && VM.utils.isOdd(parsedValue)) msgs.push(VM.messages.even);
          if (options.only_integer && !VM.utils.isInt(parsedValue)) msgs.push(VM.messages.not_an_integer);
          $.each(operators, function(key, operator) {
            if (key in options && !VM.utils.check(parsedValue, operators[key], options[key]))
              msgs.push(options.message || VM.utils.cntMsg(VM.messages[key], options[key]));
          });
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
      stringedArray: function(array) { return $.map(array, function(i) { return i.toString(); }); }

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
