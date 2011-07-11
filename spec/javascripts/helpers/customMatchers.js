var customMatchers = {
  // custom jasmine-jquery matchers
  // TODO: write as extension to jasmine-jquery
  toHaveEvent: function(eventType){
    return (this.actual.data('events')) && (typeof this.actual.data('events')[eventType] == 'object');
  },
  toHaveLive: function(eventType) {
    var hasLive, actual = this.actual;
    $.each($(document).data('events')['live'], function(i, item) {          
      hasLive = ((item.selector == actual.selector) && (item.origType == eventType));
      if (hasLive) return false;          
    });        
    return hasLive;
  },
  // other jasmine matchers
  toBeInstanceOf: function(instanceType) {
    return this.actual instanceof instanceType;
  }
};

