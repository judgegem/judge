describe('Judge', function() {

  beforeEach(function() {
    this.addMatchers(tsCustomMatchers);
  });

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

    describe('inclusion', function() {
      xit('returns false when value is found in array', function() {
        expect(Judge.Validators.inclusion('2', { in:[1,2,3] })).toEqual(false);
      });

      xit('invalidates when value is not in array', function() {
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'] })).toContain(Judge.DefaultErrors.inclusion);
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'], message:'not allowed, pal' })).toContain('not allowed, pal');
      });
    });

    describe('exclusion', function() {
      xit('returns false when value is not found in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[5,6,7] })).toEqual(false);
      });

      xit('invalidates when value is in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[1,2,3] })).toContain(Judge.DefaultErrors.exclusion);
        expect(Judge.Validators.exclusion('2', { in:[1,2,3], message:'not allowed, man' })).toContain('not allowed, man');
      });
    });

    describe('numericality', function() {
      xit('invalidates when value is not a number', function() {
        expect(Judge.Validators.numericality('qwerty', {})).toContain('is not a number');
      });
      xit('validates oddness', function() {
        expect(Judge.Validators.numericality('2', { odd: true })).toContain(Judge.DefaultErrors.odd);
        expect(Judge.Validators.numericality('3', { odd: true })).toEqual(false);
      });
      xit('validates evenness', function() {
        expect(Judge.Validators.numericality('1', { even: true })).toContain(Judge.DefaultErrors.even);
        expect(Judge.Validators.numericality('2', { even: true })).toEqual(false);
      });
      xit('validates integerness', function() {
        expect(Judge.Validators.numericality('1.34', { only_integer: true })).toContain(Judge.DefaultErrors.not_an_integer);
        expect(Judge.Validators.numericality('1', { only_integer: true })).toEqual(false);
      });
      xit('validates greater than', function() {
        expect(Judge.Validators.numericality('1', { greater_than: 3.5 })).toContain('must be greater than 3.5');
        expect(Judge.Validators.numericality('5', { greater_than: 3 })).toEqual(false);
      });
      xit('validates less than', function() {
        expect(Judge.Validators.numericality('5', { less_than: 3 })).toContain('must be less than 3');
        expect(Judge.Validators.numericality('1', { less_than: 3 })).toEqual(false);
      });
      xit('validates equal to', function() {
        expect(Judge.Validators.numericality('5', { equal_to: 3 })).toContain('must be equal to 3');
        expect(Judge.Validators.numericality('3.5', { equal_to: 3.5 })).toEqual(false);
      });
      xit('validates less than or equal to', function() {
        expect(Judge.Validators.numericality('5', { less_than_or_equal_to: 3 })).toContain('must be less than or equal to 3');
        expect(Judge.Validators.numericality('3', { less_than_or_equal_to: 3 })).toEqual(false);
        expect(Judge.Validators.numericality('1', { less_than_or_equal_to: 3 })).toEqual(false);
      });
      xit('validates greater than or equal to', function() {
        expect(Judge.Validators.numericality('1', { greater_than_or_equal_to: 3 })).toContain('must be greater than or equal to 3');
        expect(Judge.Validators.numericality('3', { greater_than_or_equal_to: 3 })).toEqual(false);
        expect(Judge.Validators.numericality('5', { greater_than_or_equal_to: 3 })).toEqual(false);
      });
    });

    describe('format', function() {
      xit('validates with', function() {
        expect(Judge.Validators.format('abc123', { with:'(-imx:[a-z])' })).toEqual(false);
        expect(Judge.Validators.format('123456', { with:'(-imx:[a-z])' })).toContain(Judge.DefaultErrors.invalid);
        expect(Judge.Validators.format('123456', { with:'(-imx:[a-z])', message: 'wiener' })).toContain('wiener');
      });
      xit('validates without', function() {
        expect(Judge.Validators.format('987654', { without:'(-imx:[a-z])' })).toEqual(false);
        expect(Judge.Validators.format('123xyz', { without:'(-imx:[a-z])' })).toContain(Judge.DefaultErrors.invalid);
        expect(Judge.Validators.format('123xyz', { without:'(-imx:[a-z])', message: 'hotdog' })).toContain('hotdog');
      });
    });

  });

  describe('Utilities', function() {
    
    describe('messageWithCount', function() {
      xit('should sub in a number from string', function() {
        expect(Judge.Utilities.messageWithCount('should be greater than %{count}', '2')).toEqual('should be greater than 2');
      });
      xit('should sub in a number from number', function() {
        expect(Judge.Utilities.messageWithCount('should be greater than %{count}', 34)).toEqual('should be greater than 34');
      });
    });

    describe('isInt', function() {
      xit('returns true when int', function() {
        expect(Judge.Utilities.isInt(1)).toEqual(true);
        expect(Judge.Utilities.isInt(1.)).toEqual(true);
        expect(Judge.Utilities.isInt(1.0)).toEqual(true);
        expect(Judge.Utilities.isInt(0)).toEqual(true);
        expect(Judge.Utilities.isInt(-1)).toEqual(true);
      });
      xit('returns false when not int', function() {
        expect(Judge.Utilities.isInt(1.1)).toEqual(false);
        expect(Judge.Utilities.isInt(-1.1)).toEqual(false);
      });
    });

    describe('isFloat', function() {
      xit('returns true when float', function() {
        expect(Judge.Utilities.isFloat(1.1)).toEqual(true);
        expect(Judge.Utilities.isFloat(-1.1)).toEqual(true);
      });
      xit('returns false when not float', function() {
         expect(Judge.Utilities.isFloat(1)).toEqual(false);
         expect(Judge.Utilities.isFloat(1.)).toEqual(false);
         expect(Judge.Utilities.isFloat(1.0)).toEqual(false);
         expect(Judge.Utilities.isFloat(0)).toEqual(false);
         expect(Judge.Utilities.isFloat(-1)).toEqual(false);
      });
    });

    describe('isEven', function() {
      xit('returns true when even', function() {
        expect(Judge.Utilities.isEven(2)).toEqual(true);
        expect(Judge.Utilities.isEven(0)).toEqual(true);
        expect(Judge.Utilities.isEven(-2)).toEqual(true);
      });
      xit('returns false when odd', function() {
        expect(Judge.Utilities.isEven(1)).toEqual(false);
        expect(Judge.Utilities.isEven(-1)).toEqual(false);
      });
    });

    describe('isOdd', function() {
      xit('returns true when odd', function() {
        expect(Judge.Utilities.isOdd(1)).toEqual(true);
        expect(Judge.Utilities.isOdd(-1)).toEqual(true);
      });
      xit('returns false when even', function() {
        expect(Judge.Utilities.isOdd(2)).toEqual(false);
        expect(Judge.Utilities.isOdd(0)).toEqual(false);
        expect(Judge.Utilities.isOdd(-2)).toEqual(false);
      });
    });

    describe('check', function() {
      xit('evaluates and returns true or false', function() {
        expect(Judge.Utilities.check(1, '<', 4)).toEqual(true);
        expect(Judge.Utilities.check(1, '==', 1)).toEqual(true);
        expect(Judge.Utilities.check(1, '>=', 4)).toEqual(false);
      });
    });

    describe('convertRegExp', function() {
      xit('converts string format options-first ruby regexp into RegExp object', function() {
        var re = Judge.Utilities.convertRegExp('(?mix:[A-Z0-9])');
        expect(re).toBeInstanceOf(RegExp);
        expect(re.source).toEqual('[A-Z0-9]');
        expect(re.multiline).toEqual(true);
        expect(re.global).toEqual(false);
      });
    });

    describe('convertFlags', function() {
      xit('returns m if present in options string without negation', function() {
        expect(Judge.Utilities.convertFlags('imx')).toEqual('m');
      });
      xit('returns empty string otherwise', function() {
        expect(Judge.Utilities.convertFlags('-imx')).toEqual('');
        expect(Judge.Utilities.convertFlags('ix')).toEqual('');
        expect(Judge.Utilities.convertFlags('-m')).toEqual('');
      });
    });


  });

  xdescribe('Internals', function() {

  });

});
