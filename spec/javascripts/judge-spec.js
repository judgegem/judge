describe('judge', function() {
  var server,
      uniquenessAttr   = '[{"kind":"uniqueness","options":{},"messages":{},"original_value":"leader"}]',
      presenceAttr     = '[{"kind":"presence","options":{},"messages":{"blank":"must not be blank"}}]',
      uniqPresenceAttr = '[{"kind":"uniqueness","options":{},"messages":{},"original_value":"leader"},{"kind":"presence","options":{},"messages":{"blank":"must not be blank"}}]',
      mixedAttr        = '[{"kind":"presence","options":{},"messages":{"blank":"must not be blank"}},{"kind":"inclusion","options":{"in":["a","b"]},"messages":{"inclusion":"must be a or b"}}]',
      uniqAndIncAttr  = '[{"kind":"uniqueness","options":{},"messages":{}},{"kind":"inclusion","options":{"in":["a","b"]},"messages":{"inclusion":"must be a or b"}}]';

  beforeEach(function() {
    this.addMatchers(customMatchers);
    server = sinon.fakeServer.create();
  });
  afterEach(function() {
    server.restore();
  });

  describe('judge.validate', function() {
    var el;
    beforeEach(function() {
      el = document.createElement('input');
      el.setAttribute('data-validate', mixedAttr);
    });
    it('returns a ValidationQueue', function() {
      expect(judge.validate(el)).toEqual(jasmine.any(judge.ValidationQueue));
    });
    describe('when given one callback', function() {
      it('calls callback with status and messages', function() {
        var callback = jasmine.createSpy();
        el.value = '';
        judge.validate(el, callback);
        expect(callback).toHaveBeenCalledWith(el, 'invalid', ['must not be blank', 'must be a or b']);
        expect(callback.callCount).toEqual(1);
      });
    });
    describe('when given named callbacks', function() {
      it('calls first callback when queue is closed as valid', function() {
        var first = jasmine.createSpy(), second = jasmine.createSpy();
        el.value = 'a';
        judge.validate(el, {
          valid: first,
          invalid: second
        });
        expect(first).toHaveBeenCalled();
        expect(first.callCount).toEqual(1);
      });
      it('calls second callback wth messages when queue is closed as invalid', function() {
        var first = jasmine.createSpy('first'), second = jasmine.createSpy('second');
        el.value = ''
        judge.validate(el, {
          valid: first,
          invalid: second
        });
        expect(second).toHaveBeenCalledWith(el, ['must not be blank', 'must be a or b']);
        expect(second.callCount).toEqual(1);
      });
    });

    describe('when checking local and remote validation messages', function() {
      it('calls valid callback when remote(unique) validation is eventually closed', function() {
        var valid = jasmine.createSpy(), invalid = jasmine.createSpy();
        el.setAttribute('data-validate', uniqAndIncAttr);
        el.value = 'a';

        var queue = judge.validate(el, {
          valid: valid,
          invalid: invalid
        });
        expect(valid).not.toHaveBeenCalled();
        expect(invalid).not.toHaveBeenCalled();

        queue.validations[0].close([]);
        expect(valid).toHaveBeenCalledWith(el, []);
        expect(valid.callCount).toEqual(1);
      });
      it('calls invalid callback when remote(unique) validation is eventually closed', function() {
        var valid = jasmine.createSpy(), invalid = jasmine.createSpy();
        el.setAttribute('data-validate', uniqAndIncAttr);
        el.value = 'c'; // Not included, will fail.

        var queue = judge.validate(el, {
          valid: valid,
          invalid: invalid
        });
        expect(valid).not.toHaveBeenCalled();
        expect(invalid).not.toHaveBeenCalled();

        queue.validations[0].close([]);
        expect(invalid).toHaveBeenCalledWith(el, ["must be a or b"]);
        expect(invalid.callCount).toEqual(1);
      });
    });
  });

  describe('judge.Dispatcher', function() {
    var object;
    beforeEach(function() {
      object = {};
      _.extend(object, judge.Dispatcher);
    });
    describe('on/trigger', function() {
      var callback;
      beforeEach(function() {
        callback = jasmine.createSpy();
      });
      it('stores callback', function() {
        object.on('eventName', callback);
        expect(object._events.eventName[0].callback).toBe(callback);
      });
      it('triggers callback', function() {
        object.on('eventName', callback);
        object.trigger('eventName', 10, 20);
        expect(callback).toHaveBeenCalledWith(10, 20);
      });
    });
    it('works with multiple callbacks', function() {
      var first  = jasmine.createSpy(), second = jasmine.createSpy();
      object.on('eventName', first);
      object.on('eventName', second);
      object.trigger('eventName');
      expect(first).toHaveBeenCalled();
      expect(second).toHaveBeenCalled();
    });
    it('triggers bind event when event is bound', function() {
      spyOn(object, 'trigger');
      var callback = jasmine.createSpy();
      object.on('eventName', callback);
      expect(object.trigger).toHaveBeenCalledWith('bind', 'eventName');
    });
  });

  describe('judge.ValidationQueue', function() {
    var el, queue;
    describe('constructor', function() {
      beforeEach(function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', uniqPresenceAttr);
        queue = new judge.ValidationQueue(el);
      });
      it('creates Validation objects from data attr', function() {
        expect(queue.validations[0]).toEqual(jasmine.any(judge.Validation));
      });
      it('creates one Validation for each object in data attr JSON array', function() {
        expect(queue.validations.length).toBe(2);
      });
      it('binds closed event to stored Validations', function() {
        expect(_.keys(queue.validations[0]._events)).toContain('close');
      });
    });
    describe('closing the queue', function() {
      var callback;
      it('triggers close event when queued Validations are eventually closed', function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', uniquenessAttr);
        queue = new judge.ValidationQueue(el);
        callback = jasmine.createSpy();

        queue.on('close', callback);
        expect(callback).not.toHaveBeenCalled();

        queue.validations[0].close([]);
        expect(callback).toHaveBeenCalledWith(el, 'valid', []);
        expect(callback.callCount).toEqual(1);
      });
      it('triggers close event immediately if queued Validations are closed when event is bound', function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', presenceAttr);
        queue = new judge.ValidationQueue(el);
        callback = jasmine.createSpy();
        queue.on('close', callback);
        expect(callback).toHaveBeenCalledWith(el, 'invalid', ['must not be blank']);
        expect(callback.callCount).toEqual(1);
      });
      it('does not trigger close event if queued Validations are never closed', function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', uniquenessAttr);
        queue = new judge.ValidationQueue(el);
        callback = jasmine.createSpy();
        queue.on('close', callback);
        expect(callback).not.toHaveBeenCalled();
      });
      it('triggers valid event if all queued Validations are valid when closed', function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', presenceAttr);
        el.value = 'foo';
        queue = new judge.ValidationQueue(el);
        callback = jasmine.createSpy();
        queue.on('valid', callback);
        expect(callback).toHaveBeenCalledWith(el, []);
        expect(callback.callCount).toEqual(1);
      });
      it('triggers invalid event if any queued Validations are invalid when closed', function() {
        el = document.createElement('input');
        el.setAttribute('data-validate', presenceAttr);
        queue = new judge.ValidationQueue(el);
        callback = jasmine.createSpy();
        queue.on('invalid', callback);
        expect(callback).toHaveBeenCalledWith(el, ['must not be blank']);
        expect(callback.callCount).toEqual(1);
      });
    });
  });

  describe('judge.Validation', function() {
    var validation;
    describe('constructor', function() {
      it('is pending when no messages given to constructor', function() {
        validation = new judge.Validation();
        expect(validation.status()).toBe('pending');
      });
      it('is closed as invalid when present messages array given to constructor', function() {
        validation = new judge.Validation(['foo']);
        expect(validation.status()).toBe('invalid');
      });
      it('is closed as valid when empty array given to constructor', function() {
        validation = new judge.Validation([]);
        expect(validation.status()).toBe('valid')
      });
    });
    describe('close method', function() {
      it('is closed as valid when empty array is given', function() {
        validation = new judge.Validation();
        validation.close([]);
        expect(validation.status()).toBe('valid');
      });
      it('is closed as invalid when present array is given', function() {
        validation = new judge.Validation();
        validation.close(['foo']);
        expect(validation.status()).toBe('invalid');
      });
      it('does not overwrite messages once set', function() {
        validation = new judge.Validation();
        validation.close(['foo']);
        validation.close([]);
        expect(validation.messages).toEqual(['foo']);
      });
      it('triggers closed event with correct args', function() {
        validation = new judge.Validation();
        callback = jasmine.createSpy();
        validation.on('close', callback);
        validation.close(['foo']);
        expect(callback).toHaveBeenCalledWith('invalid', ['foo']);
      });
    });
  });

  describe('eachValidators', function() {
    var el, validator;
    beforeEach(function() {
      el = document.createElement('input');
    });

    describe('presence', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.presence, el);
      });
      it('returns invalid Validation if element has no value', function() {
        expect(validator({}, { blank: 'Must not be blank' })).toBeInvalid();
      });
      it('returns valid Validation if element has value', function() {
        el.value = 'foo';
        expect(validator({}, { blank: 'Must not be blank' })).toBeValid();
      });
    });

    describe('length', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.length, el);
      });
      it('returns invalid Validation if value is too short', function() {
        el.value = 'abc'
        expect(validator({ minimum: 5 }, { too_short: '2 shrt' })).toBeInvalidWith(['2 shrt']);
      });
      it('returns invalid Validation if value is too long', function() {
        el.value = 'abcdef'
        expect(validator({ maximum: 5 }, { too_long: '2 lng' })).toBeInvalidWith(['2 lng']);
      });
      it('returns valid Validation for valid value', function() {
        el.value = 'abc';
        expect(validator({ minimum: 2, maximum: 5 }, {})).toBeValid();
      });
    });

    describe('exclusion', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.exclusion, el);
      });
      it('returns valid Validation when value is not in array', function() {
        el.value = 'baz';
        expect(validator({ 'in': ['foo', 'bar'] }, {})).toBeValid();
      });
      it('returns invalid Validation when value is in array', function() {
        el.value = 'foo';
        var validation = validator(
          { 'in': ['foo', 'bar'] },
          { exclusion: 'foo and bar are not allowed' }
        );
        expect(validation).toBeInvalidWith(['foo and bar are not allowed']);
      });
    });

    describe('inclusion', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.inclusion, el);
      });
      it('returns valid Validation when value is in array', function() {
        el.value = 'foo';
        expect(validator({ 'in': ['foo', 'bar'] }, {})).toBeValid();
      });
      it('returns invalid Validation when value is not in array', function() {
        el.value = 'baz';
        expect(validator({ 'in': ['foo', 'bar'] }, { inclusion: 'must be foo or bar' })).toBeInvalidWith(['must be foo or bar']);
      });
    });

    describe('numericality', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.numericality, el);
      });

      it('returns invalid Validation when value is not a number', function() {
        el.value = 'abc';
        expect(validator({}, { not_a_number: 'not a number' })).toBeInvalidWith(['not a number']);
      });

      it('returns invalid Validation when value must be odd but is even', function() {
        el.value = '2';
        expect(validator({ odd: true }, { odd: 'must be odd' })).toBeInvalidWith(['must be odd'])
      });

      it('returns valid Validation when value must be odd and is odd', function() {
        el.value = '1';
        expect(validator({ odd: true }, {})).toBeValid();
      });

      it('returns invalid Validation when value must be even but is odd', function() {
        el.value = '1';
        expect(validator({ even: true }, { even: 'must be even' })).toBeInvalidWith(['must be even'])
      });

      it('returns valid Validation when value must be even and is even', function() {
        el.value = '2';
        expect(validator({ even: true }, {})).toBeValid();
      });

      it('returns valid Validation when value must be an integer and value is an integer', function() {
        el.value = '1';
        expect(validator({ only_integer: true }, {})).toBeValid();
      });

      it('returns invalid Validation when value must be an integer and value is a float', function() {
        el.value = '1.1';
        expect(validator({ only_integer: true }, { not_an_integer: 'must be integer' })).toBeInvalidWith(['must be integer']);
      });

      it('returns invalid Validation when value is too low', function() {
        el.value = '1';
        expect(validator({ greater_than: 2 }, { greater_than: 'too low' })).toBeInvalidWith(['too low']);
      });

      it('returns valid Validation when value is high enough', function() {
        el.value = '3';
        expect(validator({ greater_than: 2 }, {})).toBeValid();
      });

      it('returns invalid Validation when value is too high', function() {
        el.value = '2';
        expect(validator({ less_than: 2 }, { less_than: 'too high' })).toBeInvalidWith(['too high']);
      });

      it('returns valid Validation when value is low enough', function() {
        el.value = '1';
        expect(validator({ less_than: 2 }, {})).toBeValid();
      });
    });

    describe('format', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.format, el);
      });

      describe('with', function() {
        it('returns invalid Validation when value does not match with', function() {
          el.value = '123';
          expect(validator({ 'with': '(?-mix:[A-Za-z]+)' }, { invalid: 'is invalid' })).toBeInvalidWith(['is invalid']);
        });

        it('returns valid Validation when value matches with', function() {
          el.value = 'AbC';
          expect(validator({ 'with': '(?-mix:[A-Za-z]+)' }, {})).toBeValid();
        });
      });

      describe('without', function() {
        it('returns invalid Validation when value matches without', function() {
          el.value = 'AbC';
          expect(validator({ without: '(?-mix:[A-Za-z]+)' }, { invalid: 'is invalid' })).toBeInvalidWith(['is invalid']);
        });

        it('returns valid Validation when value does not match without', function() {
          el.value = '123';
          expect(validator({ without: '(?-mix:[A-Za-z]+)' }, {})).toBeValid();
        });
      });
    });

    describe('acceptance', function() {
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.acceptance, el);
      });
      it('returns valid Validation when el is checked', function() {
        el.type = 'checkbox';
        el.checked = true;
        expect(validator({ accept: 1 }, {})).toBeValid();
      });
      it('returns invalid Validation when el is not checked', function() {
        el.type = 'checkbox';
        expect(validator({ accept: 1 }, { accepted: 'must be accepted' })).toBeInvalidWith(['must be accepted']);
      });
    });

    describe('confirmation', function() {
      var confEl;
      beforeEach(function() {
        validator = _.bind(judge.eachValidators.confirmation, el);
        el.id = 'pw';
        confEl = document.createElement('input');
        confEl.id = 'pw_confirmation';
        document.body.appendChild(confEl);
      });
      afterEach(function() {
        document.body.removeChild(confEl);
      });
      it('returns a valid Validation when values match', function() {
        el.value = 'foo', confEl.value = 'foo';
        expect(validator({}, {})).toBeValid();
      });
      it('returns a valid Validation when values match', function() {
        el.value = 'foo', confEl.value = 'bar';
        expect(validator({}, { confirmation: 'must be confirmed' })).toBeInvalidWith(['must be confirmed']);
      });
    });

    describe('uniqueness', function() {
      var validation;
      beforeEach(function() {
        validator  = _.bind(judge.eachValidators.uniqueness, el);
        el.value   = 'leader@team.com';
        el.name    = 'team[leader][email]';
        el.setAttribute('data-validate', uniquenessAttr);
        el.setAttribute('data-klass', 'Leader');
      });
      it('returns a pending Validation', function() {
        validation = validator({}, {});
        expect(validation).toBePending();
      });
      it('makes request to correct path', function() {
        runs(function() {
          server.respondWith([200, {}, '[]']);
          validation = validator({}, {});
        });
        runs(function() {
          server.respond();
        });
        runs(function() {
          expect(server.requests[0].url).toBe('/judge?klass=Leader&attribute=email&value=leader%40team.com&kind=uniqueness&original_value=leader');
        });
      });
      it('closes Validation as valid if the server responds with an empty JSON array', function() {
        runs(function() {
          server.respondWith([200, {}, '[]']);
          validation = validator({}, {});
        });
        runs(function() {
          server.respond();
        });
        runs(function() {
          expect(validation).toBeValid();
        });
      });
      it('closes Validation as invalid if the server responds with a JSON array of error messages', function() {
        runs(function() {
          server.respondWith([200, {}, '["already taken"]']);
          validation = validator({}, {});
        });
        runs(function() {
          server.respond();
        });
        runs(function() {
          expect(validation).toBeInvalidWith(['already taken']);
        });
      });
      it('throws error if server responds with a non-20x status', function() {
        runs(function() {
          server.respondWith([500, {}, 'Server error']);
          validation = validator({}, {});
        });
        runs(function() {
          server.respond();
        });
        runs(function() {
          expect(validation).toBeInvalidWith(['Request error: 500']);
        });
      });
    });

    describe('user added validator', function() {
      beforeEach(function() {
        judge.eachValidators.foo = function(options, messages) {
          return new judge.Validation(['nope']);
        };
        validator = _.bind(judge.eachValidators.foo, el);
      });
      it('is callable in the same way as standard validators', function() {
        var validation = validator({}, {});
        expect(validation).toBeInvalid();
      });
    });

  });

});
