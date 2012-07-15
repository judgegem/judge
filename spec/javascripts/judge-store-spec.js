describe('judge.store', function() {

  beforeEach(function() {
    this.addMatchers(customMatchers);
  });

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