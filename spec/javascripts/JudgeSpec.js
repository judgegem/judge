describe('Judge', function() {

  describe('constructor', function() {
  
    var j;
    
    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
      j = new Judge(document.getElementById('foo_one'));
    });

    it('returns new instance of Judge', function() {
      expect(typeof j).toEqual('object');
      expect(j.constructor).toEqual(Judge);
    });

    it('associates with element', function() {
      expect(j.element).toEqual(document.getElementById('foo_one'));
    });

    it('stores validators', function() {
      expect(_(j.validators).isArray()).toEqual(true);
      expect(_(j.validators).isEmpty()).toEqual(false);
    });

  });

  describe('instance validation methods', function() {

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/form.html');
    });
    
    describe('presence', function() {
      
      var j;

      beforeEach(function() {
        j = new Judge(document.getElementById('foo_one'));
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
        j = new Judge(document.getElementById('foo_two'));
        jIs = new Judge(document.getElementById('foo_two_is'));
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
        expect(j.validate().messages).toContain(j.defaultMessages.too_short);
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

   });
   
});
