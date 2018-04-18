# [Judge](http://rubygems.org/gems/judge)

[![Build status](https://secure.travis-ci.org/joecorcoran/judge.png?branch=master)](http://travis-ci.org/joecorcoran/judge)

Judge allows easy client side form validation for Rails by porting many `ActiveModel::Validation` features to JavaScript. The most common validations work through JSON strings stored within HTML5 data attributes and are executed purely on the client side. Wherever you need to, Judge provides a simple interface for AJAX validations too.

## Rationale

Whenever we need to give the user instant feedback on their form data, it's common to write some JavaScript to test form element values. Since whatever code we write to manage our data integrity in Ruby has to be copied as closely as possible in JavaScript, we end up with some very unsatisfying duplication of application logic.

In many cases it would be simpler to safely expose the validation information from our models to the client – this is where Judge steps in.

## Installation

Judge supports Rails 5.0+.
If you require Rails 4 support, please use version 2.1.x.

Judge relies on [Underscore.js](underscore) in general and [JSON2.js](json2) for browsers that lack proper JSON support. If your application already makes use of these files, you can safely ignore the versions provided with Judge.

### With asset pipeline enabled

Add `judge` to your Gemfile and run `bundle install`.

Mount the engine in your routes file, as follows:

```ruby
# config/routes.rb
mount Judge::Engine => '/judge'
```

Judge makes three JavaScript files available. You'll always need *judge.js* and *underscore.js*, whereas *json2.js* is only needed in older browsers. Add the following lines to *application.js*:

```
//= require underscore
//= require json2
//= require judge
```

### Without asset pipeline

Add `judge` to your Gemfile and run `bundle install`. Then run

```bash
$ rails generate judge:install path/to/your/js/dir
```

to copy *judge.js* to your application. There are **--json2** and **--underscore** options to copy the dependencies too.

Mount the engine in your routes file, as follows:

```ruby
# config/routes.rb
mount Judge::Engine => '/judge'
```
    
## Getting started

Add a simple validation to your model.

```ruby
class Post < ActiveRecord::Base
  validates :title, :presence => true
end
```

Make sure your form uses the Judge::FormBuilder and add the :validate option to the field.

```ruby
form_for(@post, :builder => Judge::FormBuilder) do |f|
  f.text_field :title, :validate => true
end
```

On the client side, you can now validate the title input.

```javascript
judge.validate(document.getElementById('post_title'), {
  valid: function(element) {
    element.style.border = '1px solid green';
  },
  invalid: function(element, messages) {
    element.style.border = '1px solid red';
    alert(messages.join(','));
  }
});
```

## Judge::FormBuilder

You can use any of the methods from the standard ActionView::Helpers::FormBuilder – just add `:validate => true` to the options hash.

```ruby
f.date_select :birthday, :validate => true
```

If you need to use Judge in conjunction with your own custom `FormBuilder` methods, make sure your `FormBuilder` inherits from `Judge::FormBuilder` and use the `#add_validate_attr!` helper.

```ruby
class MyFormBuilder < Judge::FormBuilder
  def fancy_text_field(method, options = {})
    add_validate_attr!(self.object, method, options)
    # do your stuff here
  end
end
```

## Available validators

* presence;
* length (options: *minimum*, *maximum*, *is*);
* exclusion (options: *in*);
* inclusion (options: *in*);
* format (options: *with*, *without*); and
* numericality (options: *greater_than*, *greater_than_or_equal_to*, *less_than*, *less_than_or_equal_to*, *equal_to*, *odd*, *even*, *only_integer*);
* acceptance;
* confirmation (input and confirmation input must have matching ids);
* uniqueness;
* any `EachValidator` that you have written, provided you add a JavaScript version too and add it to `judge.eachValidators`.

The *allow_blank* option is available everywhere it should be.

### Error messages
Error messages are looked up according to the [Rails i18n API](http://guides.rubyonrails.org/i18n.html#error-message-interpolation).

To override error messages, add entries to `config/locales/en.yml` for the messages you'd like to customize. Here's an example with Rails default values:
```
en:
  errors:
    format: "%{attribute} %{message}"
    messages:
      accepted: must be accepted
      blank: can't be blank
      present: must be blank
      confirmation: doesn't match %{attribute}
      empty: can't be empty
      equal_to: must be equal to %{count}
      even: must be even
      exclusion: is reserved
      greater_than: must be greater than %{count}
      greater_than_or_equal_to: must be greater than or equal to %{count}
      inclusion: is not included in the list
      invalid: is invalid
      less_than: must be less than %{count}
      less_than_or_equal_to: must be less than or equal to %{count}
      model_invalid: "Validation failed: %{errors}"
      not_a_number: is not a number
      not_an_integer: must be an integer
      odd: must be odd
      required: must exist
      taken: has already been taken
      too_long:
        one: is too long (maximum is 1 character)
        other: is too long (maximum is %{count} characters)
      too_short:
        one: is too short (minimum is 1 character)
        other: is too short (minimum is %{count} characters)
      wrong_length:
        one: is the wrong length (should be 1 character)
        other: is the wrong length (should be %{count} characters)
      other_than: must be other than %{count}
```

## Validating uniqueness

In order to validate uniqueness Judge sends requests to the mounted `Judge::Engine` path, which responds with a JSON representation of an error message array. The array is empty if the value is valid.

Since this effectively means adding an open, queryable endpoint to your application, Judge is cautious and requires you to be explicit about which attributes from which models you would like to expose for validation via XHR. Allowed attributes are configurable as in the following example. Note that you are only required to do this for `uniqueness` and any other validators you write that make requests to the server.

```ruby
# config/initializers/judge.rb
Judge.configure do
  expose Post, :title, :body
end
```

## Mounting the engine at a different location

You can choose a path other than `'/judge'` if you need to; just make sure to set this on the client side too:

```ruby
# config/routes.rb
mount Judge::Engine => '/whatever'
```

```javascript
judge.enginePath = '/whatever';
```

## Unsupported validator options

The `:tokenizer` option is not currently supported.

Options like `:if`, `:unless` and `:on` are not relevant to Judge. They are reliant on areas of your application that Judge does not expose on the client side.

By default, Judge drops these options on the client side. This seems to work well for the common case, but if you want to ignore validators with unsupported options at global level, do the following in your config.

```ruby
Judge.configure do
  ignore_unsupported_validators true
end
```

You can set this behaviour at the validator level too. In your model, use the `:judge` option.

```ruby
validates :foo, :presence => { :judge => :ignore }
```

If you've set unsupported validators to be ignored globally, you can still turn them back on at the validator level.

```ruby
validates :foo, :presence => { :judge => :force }
```

## Writing your own `EachValidator`

If you write your own `ActiveModel::EachValidator`, Judge provides a way to ensure that your I18n error messages are available on the client side. Simply pass to `uses_messages` any number of message keys and Judge will look up the translated messages. Let's run through an example.

```ruby
class FooValidator < ActiveModel::EachValidator
  uses_messages :not_foo

  def validate_each(record, attribute, value)
    unless value == 'foo'
      record.errors.add(:title, :not_foo)
    end
  end
end
```

We'll use the validator in the example above to validate the title attribute of a Post object:

```ruby
class Post < ActiveRecord::Base
  validates :title, :foo => true
end
```

```ruby
form_for(@post, :builder => Judge::FormBuilder) do |f|
  f.text_field :title, :validate => true
end
```

Judge will look for the `not_foo` message at
`activerecord.errors.models.post.attributes.title.not_foo`
first and then onwards down the [Rails I18n lookup chain](http://guides.rubyonrails.org/i18n.html#translations-for-active-record-models).

We then need to add our own validator method to the `judge.eachValidators` object on the client side:

```javascript
judge.eachValidators.foo = function(options, messages) {
  var errorMessages = [];
  // 'this' refers to the form element
  if (this.value !== 'foo') {
    errorMessages.push(messages.not_foo);
  }
  return new judge.Validation(errorMessages);
};
```

## `judge.Validation`

All client side validators must return a `Validation` – an object that can exist in three different states: *valid*, *invalid* or *pending*. If your validator function is synchronous, you can return a closed `Validation` simply by passing an array of error messages to the constructor.

```javascript
new judge.Validation([]);
  // => empty array, this Validation is 'valid'
new judge.Validation(['must not be blank']);
  // => array has messages, this Validation is 'invalid'
```

The *pending* state is provided for asynchronous validation; a `Validation` object we will close some time in the future. Let's look at an example, using jQuery's popular `ajax` function:

```javascript
judge.eachValidators.bar = function() {
  // create a 'pending' validation
  var validation = new judge.Validation();
  $.ajax('/bar-checking-service').done(function(messages) {
    // You can close a Validation with either an array
    // or a string that represents a JSON array
    validation.close(messages);
  });
  return validation;
};
```

There are helper functions, `judge.pending()` and `judge.closed()` for creating a new `Validation` too.

```javascript
judge.eachValidators.bar = function() {
  return judge.closed(['not valid']);
};

judge.eachValidators.bar = function() {
  var validation = new judge.pending();
  doAsyncStuff(function(messages) {
    validation.close(messages);
  });
  return validation;
};
```

In the unlikely event that you don't already use a library with AJAX capability, a basic function is provided for making GET requests as follows:

```javascript
judge.get('/something', {
  success: function(status, headers, text) {
    // status code 20x
  },
  error: function(status, headers, text) {
    // any other status code
  }
});
```

## Judge extensions

If you use [Formtastic](https://github.com/justinfrench/formtastic) or [SimpleForm](https://github.com/plataformatec/simple_form), there are extension gems to help you use Judge within your forms without any extra setup. They are essentially basic patches that add the `:validate => true` option to the `input` method.

### Formtastic

[https://github.com/joecorcoran/judge-formtastic](https://github.com/joecorcoran/judge-formtastic)

```ruby
gem 'judge-formtastic'
```

```ruby
semantic_form_for(@user) do |f|
  f.input :name, :validate => true
end
```

### SimpleForm

[https://github.com/joecorcoran/judge-simple_form](https://github.com/joecorcoran/judge-simple_form)

```ruby
gem 'judge-simple_form'
```

```ruby
simple_form_for(@user) do |f|
  f.input :name, :validate => true
end
```

## Contributing

Fork this repo and submit a pull request with an explanation of the changes you've made. If you're thinking of making a relatively big change, open an issue and let's discuss it first! :)

Run tests (the JavaScript tests require [PhantomJS](http://phantomjs.org/)):
```bash
$ bundle exec rake
```

To test against all supported minor versions of Rails:
```bash
$ bundle exec rake appraisal:install
$ bundle exec rake appraisal
```

## Credit

Created by [Joe Corcoran](https://corcoran.io). Thank you to every user, email corresponder and pull request submitter.

[Released under an MIT license](https://github.com/joecorcoran/judge/blob/master/LICENSE.txt).
