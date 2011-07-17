describe('judge', function() {

  beforeEach(function() {
    this.addMatchers(customMatchers);
  });

  describe('judge.Watcher', function() {
  
    var j;
    
    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
      j = new judge.Watcher(document.getElementById('foo_one'));
    });

    it('returns new instance of judge', function() {
      expect(typeof j).toEqual('object');
      expect(j.constructor).toEqual(judge.Watcher);
    });

    it('associates with element', function() {
      expect(j.element).toEqual(document.getElementById('foo_one'));
    });

    it('holds validators', function() {
      expect(_(j.validators).isArray()).toEqual(true);
      expect(_(j.validators).isEmpty()).toEqual(false);
    });

    it('holds default messages', function() {
      expect(j.defaultMessages).toBeInstanceOf(Object);
    });

    it('has validation methods in prototype', function() {
      expect(j.validates()).not.toBeEmpty();
      expect(_(j.validates()).keys()).toContain('presence');
    });

    it('has custom validation methods when defined by user', function() {
      judge.customValidators.phatness = function(options) { return { valid: true }; };
      expect(_(j.validates()).keys()).toContain('phatness');
    });

  });
    
  describe('judge.store', function() {

    var e;

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
      judge.store.clear();
      e = document.getElementById('foo_one');
    });

    describe('save / get', function() {

      it('saves Watcher against key', function() {
        judge.store.save('mykey', e);
        expect(_(judge.store.get('mykey')).first().constructor).toEqual(judge.Watcher);
        expect(_(judge.store.get('mykey')).first().element).toBe(e);
      });

      it('does not save Watcher if element has already been stored against same key', function() {
        judge.store.save('mykey', e);
        judge.store.save('mykey', e);
        expect(judge.store.get('mykey').length).toEqual(1);
      });

      it('does save Watcher again if key is different', function() {
        judge.store.save('mykey', e);
        judge.store.save('mykey2', e);
        expect(judge.store.get('mykey').length).toEqual(1);
        expect(judge.store.get('mykey2').length).toEqual(1);
      });

    });

    describe('getDOM', function() {
      
      it('returns DOM elements from stored Watchers', function() {
        judge.store.save('mykey', e);
        judge.store.save('mykey', document.getElementById('foo_two'));
        var d = judge.store.getDOM('mykey');
        expect(d.length).toEqual(2);
        expect(Object.prototype.toString.call(d[0])).toEqual('[object HTMLInputElement]');
      });

      it('returns all stored DOM elements if no key given', function() {
        judge.store.save('mykey', e);
        judge.store.save('mykey2', document.getElementById('foo_two'));
        judge.store.save('mykey2', document.getElementById('foo_three'));
        var d = judge.store.getDOM();
        expect(d.length).toEqual(3);
        expect(Object.prototype.toString.call(d[0])).toEqual('[object HTMLInputElement]');
      });

      it('returns null if key not found', function() {
        expect(judge.store.getDOM('notakey')).toEqual(null);
      });

    });

    describe('remove', function() {
      
      it('removes Watcher from store', function() {
        judge.store.save('mykey', e);
        expect(judge.store.remove('mykey', e)).not.toEqual(null);
        expect(judge.store.get('mykey').length).toEqual(0);
      });

      it('returns null if key not found', function() {
        judge.store.save('mykey', e);
        expect(judge.store.remove('notakey', e)).toEqual(null);
      });

    });

    describe('clear', function() {
      
      it('clears entire store if no key is passed', function() {
        judge.store.save('mykey', e);
        judge.store.clear();
        expect(judge.store.get()).toEqual({});
      });

      it('clears all Watchers against key', function() {
        judge.store.save('mykey', e);
        judge.store.save('mykey2', e);
        judge.store.clear('mykey');
        expect(judge.store.get('mykey')).toEqual([]);
        expect(judge.store.get('mykey2').length).toEqual(1);
      });

      it('returns null if key not found', function() {
        expect(judge.store.clear('notakey')).toEqual(null);
      });

    });

  });

  describe('judge.Watcher instance methods', function() {

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
    });
    
    describe('presence', function() {
      
      var j;

      beforeEach(function() {
        j = new judge.Watcher(document.getElementById('foo_one'));
      });
      
      it('invalidates empty input', function() {
        expect(j.validate().valid).toEqual(false);
      });

      it('returns custom message when present', function() {
        _(j.validators).first().options.message = 'hello';
        expect(j.validate().messages).toContain('hello');
      });

      it('returns default message', function() {
        expect(j.validate().messages).toContain(j.defaultMessages.blank);
      });

      it('validates non-empty input', function() {
        j.element.value = 'abcde';
        expect(j.validate().valid).toEqual(true);
      });

    });

    describe('length', function() {

      var j, jIs;

      beforeEach(function() {
        j = new judge.Watcher(document.getElementById('foo_two'));
        jIs = new judge.Watcher(document.getElementById('foo_two_is'));
      });

      it('validates valid input', function() {
        j.element.value = 'abcdef';
        expect(j.validate().valid).toEqual(true);
      });

      it('validates allow_blank', function() {
        j.element.value = '';
        expect(j.validate().valid).toEqual(true);
      });

      it('returns custom message when present', function() {
        j.element.value = 'abc';
        _(j.validators).first().options.too_short = 'oh dear';
        expect(j.validate().messages).toContain('oh dear');
      });

      it('returns default message', function() {
        j.element.value = 'abc';
        expect(j.validate().messages).toContain(judge.utils.countMsg(j.defaultMessages.too_short, 5));
      });

      it('invalidates when value is under minimum', function() {
        j.element.value = 'abc';
        expect(j.validate().valid).toEqual(false);
      });

      it('invalidates when value is over maximum', function() {
        j.element.value = 'abcdefghijkl';
        expect(j.validate().valid).toEqual(false);
      });

      it('invalidates when value is not equal to is', function() {
        jIs.element.value = 'abc';
        expect(jIs.validate().valid).toEqual(false);
      });
    });

    describe('exclusion', function() {

      var j;

      beforeEach(function() {
        j = new judge.Watcher(document.getElementById('foo_three'));
      });
      
      it('validates when value is not in array', function() {
        j.element.value = 'abc';
        expect(j.validate().valid).toEqual(true);
      });

      it('invalidates when value is in array', function() {
        j.element.value = 'foo';
        expect(j.validate().valid).toEqual(false);
      });

      it('returns default message', function() {
        j.element.value = 'foo';
        expect(j.validate().messages).toContain(j.defaultMessages.exclusion);
      });

      it('returns default message', function() {
        _(j.validators).first().options.message = 'restricted';
        j.element.value = 'foo';
        expect(j.validate().messages).toContain('restricted');
      });

    });

    describe('inclusion', function() {

      var j;

      beforeEach(function() {
        j = new judge.Watcher(document.getElementById('foo_three_inc'));
      });
      
      it('validates when value is in array', function() {
        j.element.value = '3';
        expect(j.validate().valid).toEqual(true);
      });

      it('invalidates when value is not in array', function() {
        j.element.value = '10';
        expect(j.validate().valid).toEqual(false);
      });

      it('returns default message', function() {
        j.element.value = '10';
        expect(j.validate().messages).toContain(j.defaultMessages.inclusion);
      });

      it('returns default message', function() {
        _(j.validators).first().options.message = 'must be one of defined values';
        j.element.value = 'foo';
        expect(j.validate().messages).toContain('must be one of defined values');
      });

    });

    describe('numericality', function() {

      var j, jEven, jGt, jLt;

      beforeEach(function() {
        j     = new judge.Watcher(document.getElementById('foo_four'));
        jEven = new judge.Watcher(document.getElementById('foo_four_even'));
        jGt   = new judge.Watcher(document.getElementById('foo_four_gt'));
        jLt   = new judge.Watcher(document.getElementById('foo_four_lt'));
      });

      it('invalidates when value is not a number', function() {
        j.element.value = 'foo bar';
        expect(j.validate().valid).toEqual(false);
        expect(j.validate().messages).toContain(j.defaultMessages.not_a_number);
      });

      it('validates odd / invalidates not odd', function() {
        j.element.value = '2';
        expect(j.validate().valid).toEqual(false);
        expect(j.validate().messages).toContain(j.defaultMessages.odd);
        j.element.value = '1';
        expect(j.validate().valid).toEqual(true);
      });

      it('validates even / invalidates not even', function() {
        jEven.element.value = '1';
        expect(jEven.validate().valid).toEqual(false);
        expect(jEven.validate().messages).toContain(jEven.defaultMessages.even);
        jEven.element.value = '2';
        expect(jEven.validate().valid).toEqual(true);
      });

      describe('integer', function() {

        it('validates int', function() {
          j.element.value = '1';
          expect(j.validate().valid).toEqual(true);
        });

        it('invalidates float', function() {
          j.element.value = '1.1';
          expect(j.validate().valid).toEqual(false);
          expect(j.validate().messages).toContain(j.defaultMessages.not_an_integer);
        });

      });

      describe('greater than', function() {
        
        it('invalidates not greater than', function() {
          jGt.element.value = '6';
          expect(jGt.validate().valid).toEqual(false);
          expect(jGt.validate().messages).toContain(judge.utils.countMsg(jGt.defaultMessages.greater_than, 7));
          jGt.element.value = '7';
          expect(jGt.validate().valid).toEqual(false);
          expect(jGt.validate().messages).toContain(judge.utils.countMsg(jGt.defaultMessages.greater_than, 7));
        });

        it('validates greater than', function() {
          jGt.element.value = '8';
          expect(jGt.validate().valid).toEqual(true);
        });

      });

      describe('less than', function() {
        
        it('invalidates not less than', function() {
          jLt.element.value = '8';
          expect(jLt.validate().valid).toEqual(false);
          jLt.element.value = '7';
          expect(jLt.validate().valid).toEqual(false);
        });

        it('validates less than', function() {
          jLt.element.value = '6';
          expect(jLt.validate().valid).toEqual(true);
        });

      });

      it('validates equal to', function() {
        jLt.element.value = '5';
        expect(jLt.validate().valid).toEqual(false);
        jLt.element.value = '6';
        expect(jLt.validate().valid).toEqual(true);
      });

      it('validates less than or equal to', function() {
        j.element.value = '5';
        expect(j.validate().valid).toEqual(true);
        j.element.value = '7';
        expect(j.validate().valid).toEqual(true);
        j.element.value = '9';
        expect(j.validate().valid).toEqual(false);
      });

      it('validates greater than or equal to', function() {
        jEven.element.value = '20';
        expect(jEven.validate().valid).toEqual(true);
        jEven.element.value = '2';
        expect(jEven.validate().valid).toEqual(true);
        jEven.element.value = '1';
        expect(jEven.validate().valid).toEqual(false);
      });

    });

    describe('format', function() {

      describe('with', function() {
        
        var j;

        beforeEach(function() {
          j = new judge.Watcher(document.getElementById('foo_five'));
        });

        it('validates value matching with', function() {
          j.element.value = 'ABCabc123';
          expect(j.validate().valid).toEqual(true);
        });

        it('invalidates value not matching with', function() {
          j.element.value = '123';
          expect(j.validate().valid).toEqual(false);
          expect(j.validate().messages).toContain(j.defaultMessages.invalid);
        });

      });

      describe('without', function() {

        var j;

        beforeEach(function() {
          j = new judge.Watcher(document.getElementById('foo_five_wo'));
        });

        it('validates value matching with', function() {
          j.element.value = '12345';
          expect(j.validate().valid).toEqual(true);
        });

        it('invalidates value not matching with', function() {
          j.element.value = 'AbC123';
          expect(j.validate().valid).toEqual(false);
          expect(j.validate().messages).toContain(j.defaultMessages.invalid);
        });

      });

    });

  });

  describe('utils', function() {

    describe('isValidatable', function() {
      
      it('returns true if judge can validate object', function() {
        var i = document.createElement('input'),
            s = document.createElement('select'),
            t = document.createElement('textarea');
        expect(judge.utils.isValidatable(i)).toEqual(true);
        expect(judge.utils.isValidatable(s)).toEqual(true);
        expect(judge.utils.isValidatable(t)).toEqual(true);
      });

      it('returns false otherwise', function() {
        var p = document.createElement('p');
        expect(judge.utils.isValidatable(p)).toEqual(false);
      });

    });

    describe('isCollection', function() {
      
      beforeEach(function() {
        loadFixtures('spec/javascripts/fixtures/form.html');
      });

      it('returns true if judge can treat object as collection', function() {
        var a = [],
            n = document.getElementsByTagName('input');
        expect(judge.utils.isCollection(a)).toEqual(true);
        expect(judge.utils.isCollection(n)).toEqual(true);
      });

      it('returns false otherwise', function() {
        var o = { a:1, b:2 };
        expect(judge.utils.isCollection(o)).toEqual(false);
      });

    });

    describe('getObjectString', function() {
      
      it('returns type as represented in Object.prototype.toString', function() {
        var i = document.createElement('input'),
            s = document.createElement('select');
        expect(judge.utils.getObjectString(i)).toEqual('HTMLInputElement');
        expect(judge.utils.getObjectString(s)).toEqual('HTMLSelectElement');
      });

    });

    describe('countMsg', function() {
      
      it('subs string', function() {
        expect(judge.utils.countMsg('should be less than %{count}', 5)).toEqual('should be less than 5');
      });

    });
    
    describe('isInt', function() {
      
      it('returns true when int', function() {
        expect(judge.utils.isInt(1)).toEqual(true);
        expect(judge.utils.isInt(1.)).toEqual(true);
        expect(judge.utils.isInt(1.0)).toEqual(true);
        expect(judge.utils.isInt(0)).toEqual(true);
        expect(judge.utils.isInt(-1)).toEqual(true);
      });

      it('returns false when not int', function() {
        expect(judge.utils.isInt(1.1)).toEqual(false);
        expect(judge.utils.isInt(-1.1)).toEqual(false);
      });

    });

    describe('isFloat', function() {
      
      it('returns true when float', function() {
        expect(judge.utils.isFloat(1.1)).toEqual(true);
        expect(judge.utils.isFloat(-1.1)).toEqual(true);
      });
      
      it('returns false when not float', function() {
         expect(judge.utils.isFloat(1)).toEqual(false);
         expect(judge.utils.isFloat(1.)).toEqual(false);
         expect(judge.utils.isFloat(1.0)).toEqual(false);
         expect(judge.utils.isFloat(0)).toEqual(false);
         expect(judge.utils.isFloat(-1)).toEqual(false);
      });

    });

    describe('isEven', function() {
      
      it('returns true when even', function() {
        expect(judge.utils.isEven(2)).toEqual(true);
        expect(judge.utils.isEven(0)).toEqual(true);
        expect(judge.utils.isEven(-2)).toEqual(true);
      });
      
      it('returns false when odd', function() {
        expect(judge.utils.isEven(1)).toEqual(false);
        expect(judge.utils.isEven(-1)).toEqual(false);
      });

    });

    describe('isOdd', function() {
      
      it('returns true when odd', function() {
        expect(judge.utils.isOdd(1)).toEqual(true);
        expect(judge.utils.isOdd(-1)).toEqual(true);
      });
      
      it('returns false when even', function() {
        expect(judge.utils.isOdd(2)).toEqual(false);
        expect(judge.utils.isOdd(0)).toEqual(false);
        expect(judge.utils.isOdd(-2)).toEqual(false);
      });

    });

    describe('operate', function() {
      
      it('evaluates and returns true or false', function() {
        expect(judge.utils.operate(1, '<', 4)).toEqual(true);
        expect(judge.utils.operate(1, '==', 1)).toEqual(true);
        expect(judge.utils.operate(1, '>=', 4)).toEqual(false);
      });

    });

    describe('convertRegExp', function() {
      
      it('converts string format options-first ruby regexp into RegExp object', function() {
        var re = judge.utils.convertRegExp('(?mix:[A-Z0-9])');
        expect(re).toBeInstanceOf(RegExp);
        expect(re.source).toEqual('[A-Z0-9]');
        expect(re.multiline).toEqual(true);
        expect(re.global).toEqual(false);
      });

    });

    describe('convertFlags', function() {

      it('returns m if present in options string without negation', function() {
        expect(judge.utils.convertFlags('imx')).toEqual('m');
      });

      it('returns empty string otherwise', function() {
        expect(judge.utils.convertFlags('-imx')).toEqual('');
        expect(judge.utils.convertFlags('ix')).toEqual('');
        expect(judge.utils.convertFlags('-m')).toEqual('');
      });

    });

  });
   
});
