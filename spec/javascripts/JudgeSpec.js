describe('judge', function() {

  beforeEach(function() {
    this.addMatchers(customMatchers);
  });

  describe('judge.validate', function() {

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
    });
    
    it('validates a single element', function() {
      var elements = document.getElementById('foo_one'),
          results = judge.validate(elements);
      expect(results.length).toEqual(1);
    });

    it('validates a collection of elements', function() {
      var elements = document.querySelectorAll('input[type=radio]'),
          results = judge.validate(elements);
      expect(results.length).toEqual(1);
    });

    describe('callbacks', function() {
      it('calls callback correct number of times', function() {
        var elements = document.getElementsByTagName('textarea');
            callback = jasmine.createSpy(),
            length = elements.length;
        judge.validate(elements, callback);
        expect(callback.callCount).toBe(length);
      });
    });

  });

  describe('judge.Watcher', function() {
  
    var watcher;
    
    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
      watcher = new judge.Watcher(document.getElementById('foo_one'));
    });

    it('returns new instance of judge', function() {
      expect(watcher.constructor).toEqual(judge.Watcher);
    });

    it('associates with element', function() {
      expect(watcher.element).toEqual(document.getElementById('foo_one'));
    });

    it('holds validators', function() {
      expect(_(watcher.validators).isArray()).toEqual(true);
      expect(_(watcher.validators).isEmpty()).toEqual(false);
    });

    it('holds messages inside validators', function() {
      expect(_(watcher.validators).first().messages).toBeInstanceOf(Object);
    });

    it('has validation methods in prototype', function() {
      expect(watcher.validates()).not.toBeEmpty();
      expect(_(watcher.validates()).keys()).toContain('presence');
    });

    it('has custom validation methods when defined by user', function() {
      judge.customValidators.phatness = function() {};
      expect(_(watcher.validates()).keys()).toContain('phatness');
    });

    it('throws error if element has no data-validate attribute', function() {
      var input = document.createElement('input');
      input.type = 'text';
      expect(function() { new judge.Watcher(input); }).toThrow();
    });

    it('throws error if no element is passed', function() {
      expect(function() { new judge.Watcher(); }).toThrow();
    });

  });

  describe('judge.Watcher instance methods', function() {

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
    });

    describe('validate method', function() {
      
      var watcher, result;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_one'));
        result = watcher.validate();
      });

      it('returns element', function() {
        expect(result.element).toBeInstanceOf(Object);
      });

      it('returns validity', function() {
        expect(_.isBoolean(result.valid)).toBe(true);
      });

      it('returns messages', function() {
        expect(result.messages).toBeInstanceOf(Array);
      });

      describe('callback', function() {

        var callback, args;

        beforeEach(function() {
          callback = jasmine.createSpy();
          watcher.validate(callback);
          args = callback.argsForCall[0];
        });

        it('is called when given', function() {
          expect(callback).toHaveBeenCalled();
        });
        it('receives correct args', function() {
          expect(_.isBoolean(args[0])).toBe(true);
          expect(_.isArray(args[1])).toBe(true);
          expect(_.isElement(args[2])).toBe(true);
        });
        
      });

    });
    
    describe('presence', function() {
      
      var watcher;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_one'));
      });
      
      it('invalidates empty input', function() {
        expect(watcher.validate().valid).toEqual(false);
      });

      it('validates non-empty input', function() {
        watcher.element.children[1].selected = true;
        expect(watcher.validate().valid).toEqual(true);
      });

    });

    describe('length', function() {

      var watcher;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_two_foobar'));
      });

      it('validates valid input', function() {
        watcher.element.value = 'abcdef';
        expect(watcher.validate().valid).toEqual(true);
      });

      it('validates allow_blank', function() {
        watcher.element.value = '';
        expect(watcher.validate().valid).toEqual(true);
      });

      it('invalidates when value is under minimum', function() {
        watcher.element.value = 'abc';
        expect(watcher.validate().valid).toEqual(false);
      });

      it('invalidates when value is over maximum', function() {
        watcher.element.value = 'abcdefghijkl';
        expect(watcher.validate().valid).toEqual(false);
      });
    });

    describe('exclusion', function() {

      var watcher;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_three'));
      });
      
      it('validates when value is not in array', function() {
        expect(watcher.validate().valid).toEqual(true);
      });

      it('invalidates when value is in array', function() {
        watcher.element.children[1].selected = true;
        expect(watcher.validate().valid).toEqual(false);
      });

    });

    describe('inclusion', function() {

      var watcher;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_three_inc'));
      });
      
      it('validates when value is in array', function() {
        watcher.element.children[1].selected = true;
        expect(watcher.validate().valid).toEqual(true);
      });

      it('invalidates when value is not in array', function() {
        expect(watcher.validate().valid).toEqual(false);
      });

    });

    describe('numericality', function() {

      var watcher, watcherEven, watcherGt, watcherLt;

      beforeEach(function() {
        watcher     = new judge.Watcher(document.getElementById('foo_four'));
        watcherEven = new judge.Watcher(document.getElementById('foo_four_even'));
        watcherGt   = new judge.Watcher(document.getElementById('foo_four_gt'));
        watcherLt   = new judge.Watcher(document.getElementById('foo_four_lt'));
      });

      it('invalidates when value is not a number', function() {
        watcher.element.value = 'foo bar';
        expect(watcher.validate().valid).toEqual(false);
      });

      it('validates odd / invalidates not odd', function() {
        watcher.element.value = '2';
        expect(watcher.validate().valid).toEqual(false);
        watcher.element.value = '1';
        expect(watcher.validate().valid).toEqual(true);
      });

      it('validates even / invalidates not even', function() {
        watcherEven.element.value = '1';
        expect(watcherEven.validate().valid).toEqual(false);
        watcherEven.element.value = '2';
        expect(watcherEven.validate().valid).toEqual(true);
      });

      describe('integer', function() {

        it('validates int', function() {
          watcher.element.value = '1';
          expect(watcher.validate().valid).toEqual(true);
        });

        it('invalidates float', function() {
          watcher.element.value = '1.1';
          expect(watcher.validate().valid).toEqual(false);
        });

      });

      describe('greater than', function() {
        
        it('invalidates not greater than', function() {
          watcherGt.element.value = '6';
          expect(watcherGt.validate().valid).toEqual(false);
          watcherGt.element.value = '7';
          expect(watcherGt.validate().valid).toEqual(false);
        });

        it('validates greater than', function() {
          watcherGt.element.value = '8';
          expect(watcherGt.validate().valid).toEqual(true);
        });

      });

      describe('less than', function() {
        
        it('invalidates not less than', function() {
          watcherLt.element.value = '8';
          expect(watcherLt.validate().valid).toEqual(false);
          watcherLt.element.value = '7';
          expect(watcherLt.validate().valid).toEqual(false);
        });

        it('validates less than', function() {
          watcherLt.element.value = '6';
          expect(watcherLt.validate().valid).toEqual(true);
        });
      });
    });

    describe('format', function() {

      describe('with', function() {
        
        var watcher;

        beforeEach(function() {
          watcher = new judge.Watcher(document.getElementById('foo_five_wi'));
        });

        it('invalidates value matching with', function() {
          expect(watcher.validate().valid).toEqual(false);
        });

        it('invalidates value not matching with', function() {
          watcher.element.children[1].selected = true;
          expect(watcher.validate().valid).toEqual(true);
        });

      });

      describe('without', function() {

        var watcher;

        beforeEach(function() {
          watcher = new judge.Watcher(document.getElementById('foo_five_wo'));
        });

        it('validates value not matching with', function() {
          expect(watcher.validate().valid).toEqual(true);
        });

        it('invalidates value matching with', function() {
          watcher.element.children[1].selected = true;
          expect(watcher.validate().valid).toEqual(false);
        });

      });

    });

    describe('acceptance', function() {

      var watcher;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_six'));
      });

      it('validates when element is checked', function() {
        watcher.element.checked = true;
        expect(watcher.validate().valid).toEqual(true);        
      });

      it('invalidates when element is not checked', function() {
        expect(watcher.validate().valid).toEqual(false);
      });

    });

    describe('confirmation', function() {
      
      var watcher, conf;

      beforeEach(function() {
        watcher = new judge.Watcher(document.getElementById('foo_seven'));
        conf = document.getElementById('foo_seven_confirmation');
      });

      it('validates when confirmed', function() {
        watcher.element.value = 'password';
        conf.value = 'password';
        expect(watcher.validate().valid).toEqual(true);
      });

      it('invalidates when not confirmed', function() {
        watcher.element.value = 'password';
        conf.value = 'wrongpassword';
        expect(watcher.validate().valid).toEqual(false);
      });

    });

  });

  describe('judge.store', function() {

    var element;

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
      judge.store.clear();
      element = document.getElementById('foo_one');
    });

    describe('save / get', function() {

      it('saves Watcher against key', function() {
        judge.store.save('mykey', element);
        expect(_(judge.store.get('mykey')).first().constructor).toEqual(judge.Watcher);
        expect(_(judge.store.get('mykey')).first().element).toBe(element);
      });

      it('does not save Watcher if element has already been stored against same key', function() {
        judge.store.save('mykey', element);
        judge.store.save('mykey', element);
        expect(judge.store.get('mykey').length).toEqual(1);
      });

      it('does save Watcher again if key is different', function() {
        judge.store.save('mykey', element);
        judge.store.save('mykey2', element);
        expect(judge.store.get('mykey').length).toEqual(1);
        expect(judge.store.get('mykey2').length).toEqual(1);
      });

    });

    describe('getDOM', function() {
      
      it('returns DOM elements from stored Watchers', function() {
        judge.store.save('mykey', element);
        judge.store.save('mykey', document.getElementById('foo_two_foobar'));
        var storedElements = judge.store.getDOM('mykey');
        expect(storedElements.length).toEqual(2);
        expect(Object.prototype.toString.call(storedElements[0])).toEqual('[object HTMLSelectElement]');
      });

      it('returns store object with watchers converted to elements if no key given', function() {
        judge.store.save('mykey', element);
        judge.store.save('mykey2', document.getElementById('foo_two_foobar'));
        judge.store.save('mykey2', document.getElementById('foo_three'));
        var storedElements = judge.store.getDOM();
        expect(storedElements.mykey.length).toEqual(1);
        expect(storedElements.mykey2.length).toEqual(2);
        expect(Object.prototype.toString.call(storedElements.mykey[0])).toEqual('[object HTMLSelectElement]');
      });

      it('returns null if key not found', function() {
        expect(judge.store.getDOM('notakey')).toEqual(null);
      });

    });

    describe('validate', function() {
      
      it('validates all elements stored against key', function() {
        judge.store.save('mykey', element);
        var results = judge.store.validate('mykey');
        expect(_(results).first()).toBeInstanceOf(Object);
        expect(_(results).first().element).toEqual(element);
      });

      it('calls callback correct number of times', function() {
        judge.store.save('mykey', document.getElementsByTagName('textarea'));
        var callback = jasmine.createSpy();
        judge.store.validate('mykey', callback);
        expect(callback.callCount).toBe(4);
      });

      it('returns null if no elements found', function() {
        var results = judge.store.validate('mykey');
        expect(results).toBe(null);
      });

      it('returns null if key is not passed', function() {
        var results = judge.store.validate();
        expect(results).toBe(null);
      });

    });

    describe('remove', function() {
      
      it('removes Watcher from store', function() {
        judge.store.save('mykey', element);
        expect(_(judge.store.remove('mykey', element)).isUndefined()).toEqual(true);
        expect(judge.store.get('mykey')).toBe(null);
      });

      it('returns null if key not found', function() {
        judge.store.save('mykey', element);
        expect(judge.store.remove('notakey', element)).toEqual(null);
      });

    });

    describe('clear', function() {
      
      it('clears entire store if no key is passed', function() {
        judge.store.save('mykey', element);
        judge.store.clear();
        expect(judge.store.get()).toEqual({});
      });

      it('clears all Watchers against key', function() {
        judge.store.save('mykey', element);
        judge.store.save('mykey2', element);
        judge.store.clear('mykey');
        expect(judge.store.get('mykey')).toBe(null);
        expect(judge.store.get('mykey2').length).toEqual(1);
      });

      it('returns null if key not found', function() {
        expect(judge.store.clear('notakey')).toBe(null);
      });

    });

  });
   
});
