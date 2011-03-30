describe('Judge', function() {

  beforeEach(function() {
    Judge.DefaultErrors = JSON.parse('{"inclusion":"is not included in the list","exclusion":"is reserved","invalid":"is invalid","confirmation":"doesn\'t match confirmation","accepted":"must be accepted","empty":"can\'t be empty","blank":"can\'t be blank","too_long":"is too long (maximum is %{count} characters)","too_short":"is too short (minimum is %{count} characters)","wrong_length":"is the wrong length (should be %{count} characters)","not_a_number":"is not a number","not_an_integer":"must be an integer","greater_than":"must be greater than %{count}","greater_than_or_equal_to":"must be greater than or equal to %{count}","equal_to":"must be equal to %{count}","less_than":"must be less than %{count}","less_than_or_equal_to":"must be less than or equal to %{count}","odd":"must be odd","even":"must be even"}');
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
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'] })).toContain('is not included in the list');
        expect(Judge.Validators.inclusion('2', { in:['foo','bar','baz'], message:'not allowed, pal' })).toContain('not allowed, pal');
      });
    });

    describe('exclusion', function() {
      it('returns false when value is not found in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[5,6,7] })).toEqual(false);
      });

      it('invalidates when value is in array', function() {
        expect(Judge.Validators.exclusion('2', { in:[1,2,3] })).toContain('is reserved');
        expect(Judge.Validators.exclusion('2', { in:[1,2,3], message:'not allowed, man' })).toContain('not allowed, man');
      });
    });

    describe('numericality', function() {
      xit('needs tests', function() {  });
    });

    describe('format', function() {
      xit('needs tests', function() {  });
    });

  });

  xdescribe('Utilities', function() {

  });

  xdescribe('Internals', function() {

  });

});
