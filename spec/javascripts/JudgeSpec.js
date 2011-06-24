describe('Judge', function() {

  beforeEach(function() {
    this.addMatchers(tsCustomMatchers);
    Judge.DefaultErrors = JSON.parse('{"inclusion":"is not included in the list","exclusion":"is reserved","invalid":"is invalid","confirmation":"doesn\'t match confirmation","accepted":"must be accepted","empty":"can\'t be empty","blank":"can\'t be blank","too_long":"is too long (maximum is %{count} characters)","too_short":"is too short (minimum is %{count} characters)","wrong_length":"is the wrong length (should be %{count} characters)","not_a_number":"is not a number","not_an_integer":"must be an integer","greater_than":"must be greater than %{count}","greater_than_or_equal_to":"must be greater than or equal to %{count}","equal_to":"must be equal to %{count}","less_than":"must be less than %{count}","less_than_or_equal_to":"must be less than or equal to %{count}","odd":"must be odd","even":"must be even"}');
  });

  describe('plugin', function() {

    beforeEach(function() {
      loadFixtures('spec/javascripts/fixtures/plugin.html');
    });

    it('should bind correct event to element', function() {
      $('input#foo').judge('keyup');
      expect($('input#foo')).toHaveEvent('keyup');
    });
    
  });

  describe('Validators', function() {
    
    describe('presence', function() {
      
      it('returns false if value is not blank', function() {
        expect(Judge.Validators.presence('foo', {})).toEqual(false);
      });

      it('invalidates with custom message if present, when value is blank', function() {
        expect(Judge.Validators.presence('', { message:'oh no' })).toContain('oh no');
      });

      it('invalidates default message if custom message is not present, when value is blank', function() {
        expect(Judge.Validators.presence('', {})).toContain('can\'t be blank');
      });

    });

    describe('length', function() {
      it('returns false when value is valid', function() {
        expect(Judge.Validators.length('abcdef', { minimum:5, maximum:7 })).toEqual(false);
      });

      it('invalidates when value is under minimum', function() {
        expect(Judge.Validators.length('abc', { minimum:6 })).toContain('is too short (minimum is 6 characters)');
        expect(Judge.Validators.length('abc', { minimum:6, too_short:'should be longer' })).toContain('should be longer');
      });

      it('invalidates when value is over maximum', function() {
        expect(Judge.Validators.length('abcdef', { maximum:4 })).toContain('is too long (maximum is 4 characters)');
        expect(Judge.Validators.length('abcdef', { maximum:4, too_long:'should be shorter' })).toContain('should be shorter');
      });

      it('invalidates when value is not equal to is', function() {
        expect(Judge.Validators.length('abc', { is:6 })).toContain('is the wrong length (should be 6 characters)');
        expect(Judge.Validators.length('abc', { is:6, wrong_length:'wrong length' })).toContain('wrong length');
      });

      it('invalidates when value is outside of range, using minimum and maximum', function() {
        expect(Judge.Validators.length('abc', { minimum:6, maximum:10 })).toContain('is too short (minimum is 6 characters)');
        expect(Judge.Validators.length('abcdefghijkl', { minimum:6, maximum:10 })).toContain('is too long (maximum is 10 characters)');
      });
    });

    describe('inclusion', function() {
      it('returns false when value is found in array', function() {
        expect(Judge.Validators.inclusion('2', { in:[1,2,3] })).toEqual(false);
      });

      it('invalidates when value is not in array', function() {
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'] })).toContain(Judge.DefaultErrors.inclusion);
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'], message:'not allowed, pal' })).toContain('not allowed, pal');
      });
    });

    describe('exclusion', function() {
      it('returns false when value is not found in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[5,6,7] })).toEqual(false);
      });

      it('invalidates when value is in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[1,2,3] })).toContain(Judge.DefaultErrors.exclusion);
        expect(Judge.Validators.exclusion('2', { in:[1,2,3], message:'not allowed, man' })).toContain('not allowed, man');
      });
    });

    describe('numericality', function() {
      it('invalidates when value is not a number', function() {
        expect(Judge.Validators.numericality('qwerty', {})).toContain('is not a number');
      });
      it('validates oddness', function() {
        expect(Judge.Validators.numericality('2', { odd: true })).toContain(Judge.DefaultErrors.odd);
        expect(Judge.Validators.numericality('3', { odd: true })).toEqual(false);
      });
      it('validates evenness', function() {
        expect(Judge.Validators.numericality('1', { even: true })).toContain(Judge.DefaultErrors.even);
        expect(Judge.Validators.numericality('2', { even: true })).toEqual(false);
      });
      it('validates integerness', function() {
        expect(Judge.Validators.numericality('1.34', { only_integer: true })).toContain(Judge.DefaultErrors.not_an_integer);
        expect(Judge.Validators.numericality('1', { only_integer: true })).toEqual(false);
      });
      it('validates greater than', function() {
        expect(Judge.Validators.numericality('1', { greater_than: 3.5 })).toContain('must be greater than 3.5');
        expect(Judge.Validators.numericality('5', { greater_than: 3 })).toEqual(false);
      });
      it('validates less than', function() {
        expect(Judge.Validators.numericality('5', { less_than: 3 })).toContain('must be less than 3');
        expect(Judge.Validators.numericality('1', { less_than: 3 })).toEqual(false);
      });
      it('validates equal to', function() {
        expect(Judge.Validators.numericality('5', { equal_to: 3 })).toContain('must be equal to 3');
        expect(Judge.Validators.numericality('3.5', { equal_to: 3.5 })).toEqual(false);
      });
      it('validates less than or equal to', function() {
        expect(Judge.Validators.numericality('5', { less_than_or_equal_to: 3 })).toContain('must be less than or equal to 3');
        expect(Judge.Validators.numericality('3', { less_than_or_equal_to: 3 })).toEqual(false);
        expect(Judge.Validators.numericality('1', { less_than_or_equal_to: 3 })).toEqual(false);
      });
      it('validates greater than or equal to', function() {
        expect(Judge.Validators.numericality('1', { greater_than_or_equal_to: 3 })).toContain('must be greater than or equal to 3');
        expect(Judge.Validators.numericality('3', { greater_than_or_equal_to: 3 })).toEqual(false);
        expect(Judge.Validators.numericality('5', { greater_than_or_equal_to: 3 })).toEqual(false);
      });
    });

    describe('format', function() {
      it('validates with', function() {
        expect(Judge.Validators.format('abc123', { with:'(-imx:[a-z])' })).toEqual(false);
        expect(Judge.Validators.format('123456', { with:'(-imx:[a-z])' })).toContain(Judge.DefaultErrors.invalid);
        expect(Judge.Validators.format('123456', { with:'(-imx:[a-z])', message: 'wiener' })).toContain('wiener');
      });
      it('validates without', function() {
        expect(Judge.Validators.format('987654', { without:'(-imx:[a-z])' })).toEqual(false);
        expect(Judge.Validators.format('123xyz', { without:'(-imx:[a-z])' })).toContain(Judge.DefaultErrors.invalid);
        expect(Judge.Validators.format('123xyz', { without:'(-imx:[a-z])', message: 'hotdog' })).toContain('hotdog');
      });
    });

  });

  describe('Utilities', function() {
    
    describe('messageWithCount', function() {
      it('should sub in a number from string', function() {
        expect(Judge.Utilities.messageWithCount('should be greater than %{count}', '2')).toEqual('should be greater than 2');
      });
      it('should sub in a number from number', function() {
        expect(Judge.Utilities.messageWithCount('should be greater than %{count}', 34)).toEqual('should be greater than 34');
      });
    });

    describe('isInt', function() {
      it('returns true when int', function() {
        expect(Judge.Utilities.isInt(1)).toEqual(true);
        expect(Judge.Utilities.isInt(1.)).toEqual(true);
        expect(Judge.Utilities.isInt(1.0)).toEqual(true);
        expect(Judge.Utilities.isInt(0)).toEqual(true);
        expect(Judge.Utilities.isInt(-1)).toEqual(true);
      });
      it('returns false when not int', function() {
        expect(Judge.Utilities.isInt(1.1)).toEqual(false);
        expect(Judge.Utilities.isInt(-1.1)).toEqual(false);
      });
    });

    describe('isFloat', function() {
      it('returns true when float', function() {
        expect(Judge.Utilities.isFloat(1.1)).toEqual(true);
        expect(Judge.Utilities.isFloat(-1.1)).toEqual(true);
      });
      it('returns false when not float', function() {
         expect(Judge.Utilities.isFloat(1)).toEqual(false);
         expect(Judge.Utilities.isFloat(1.)).toEqual(false);
         expect(Judge.Utilities.isFloat(1.0)).toEqual(false);
         expect(Judge.Utilities.isFloat(0)).toEqual(false);
         expect(Judge.Utilities.isFloat(-1)).toEqual(false);
      });
    });

    describe('isEven', function() {
      it('returns true when even', function() {
        expect(Judge.Utilities.isEven(2)).toEqual(true);
        expect(Judge.Utilities.isEven(0)).toEqual(true);
        expect(Judge.Utilities.isEven(-2)).toEqual(true);
      });
      it('returns false when odd', function() {
        expect(Judge.Utilities.isEven(1)).toEqual(false);
        expect(Judge.Utilities.isEven(-1)).toEqual(false);
      });
    });

    describe('isOdd', function() {
      it('returns true when odd', function() {
        expect(Judge.Utilities.isOdd(1)).toEqual(true);
        expect(Judge.Utilities.isOdd(-1)).toEqual(true);
      });
      it('returns false when even', function() {
        expect(Judge.Utilities.isOdd(2)).toEqual(false);
        expect(Judge.Utilities.isOdd(0)).toEqual(false);
        expect(Judge.Utilities.isOdd(-2)).toEqual(false);
      });
    });

    describe('check', function() {
      it('evaluates and returns true or false', function() {
        expect(Judge.Utilities.check(1, '<', 4)).toEqual(true);
        expect(Judge.Utilities.check(1, '==', 1)).toEqual(true);
        expect(Judge.Utilities.check(1, '>=', 4)).toEqual(false);
      });
    });

    describe('convertRegExp', function() {
      it('converts string format options-first ruby regexp into RegExp object', function() {
        var re = Judge.Utilities.convertRegExp('(?mix:[A-Z0-9])');
        expect(re).toBeInstanceOf(RegExp);
        expect(re.source).toEqual('[A-Z0-9]');
        expect(re.multiline).toEqual(true);
        expect(re.global).toEqual(false);
      });
    });

    describe('convertFlags', function() {
      it('returns m if present in options string without negation', function() {
        expect(Judge.Utilities.convertFlags('imx')).toEqual('m');
      });
      it('returns empty string otherwise', function() {
        expect(Judge.Utilities.convertFlags('-imx')).toEqual('');
        expect(Judge.Utilities.convertFlags('ix')).toEqual('');
        expect(Judge.Utilities.convertFlags('-m')).toEqual('');
      });
    });


  });

  xdescribe('Internals', function() {

  });

});
