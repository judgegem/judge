var customMatchers = (function() {
  var hasStatus = function(validation, status) {
        return (validation instanceof judge.Validation) && 
          (validation.status() === status)
      },
      matchers = {
        toBeInstanceOf: function(instanceType) {
          return this.actual instanceof instanceType;
        },
        toBePending: function() {
          return hasStatus(this.actual, 'pending');
        },
        toBeValid: function() {
          return hasStatus(this.actual, 'valid');
        },
        toBeInvalid: function() {
          return hasStatus(this.actual, 'invalid');
        },
        toBeInvalidWith: function(messages) {
          return hasStatus(this.actual, 'invalid') &&
            _.isEqual(this.actual.messages, messages);
        }
      };

  return matchers;
})();

