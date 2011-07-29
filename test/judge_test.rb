require 'test_helper'

class JudgeTest < ActionController::TestCase
  tests FoosController
  
  context "form tag" do
    should "include validation messages in data attribute" do
      get :new
      assert_equal Hash, error_messages.class
      assert error_messages.include? "inclusion"
    end
  end

  context "validators" do
    setup { get :new }

    should "include presence validation in data attribute" do
      assert_equal "presence", validators_from("select#foo_one").first["kind"]
    end

    should "include length (within range) validation in data attribute" do
      validators = validators_from("input#foo_two_foobar")
      assert_equal "length", validators.first["kind"]
      assert_equal Fixnum, validators.first["options"]["minimum"].class
      assert_equal Fixnum, validators.first["options"]["maximum"].class
      assert validators.first["options"]["allow_blank"]
    end

    should "include allow_blank validation in data attribute" do
      validators = validators_from("input#foo_two_foobar")
      assert validators.first["options"]["allow_blank"]
    end

    should "include exclusion validation in data atribute" do
      validators = validators_from("select#foo_three")
      assert_equal "exclusion", validators.first["kind"]
      assert_equal Array, validators.first["options"]["in"].class
    end

    should "include numericality validation in data attribute" do
      validator = validators_from("textarea#foo_four").first
      assert_equal "numericality", validator["kind"]
      assert validator["options"]["only_integer"]
      assert validator["options"]["odd"]
      assert_equal false, validator["options"]["allow_nil"]
      assert_equal Fixnum, validator["options"]["less_than_or_equal_to"].class
    end

    should "include exclusion validation in data attribute" do
      validator = validators_from("textarea#foo_four")[1]
      assert_equal "exclusion", validator["kind"]
      assert_equal Array, validator["options"]["in"].class
    end

    should "include format validator in data attribute" do
      validator = validators_from("select#foo_five").first
      assert_equal "format", validator["kind"]
      assert_match /\(.+\:.+\)/, validator["options"]["without"]
    end

    should "include acceptance validator in data attribute" do
      validator = validators_from("input#foo_six").first
      assert_equal "acceptance", validator["kind"]
      assert validator["options"]["accept"]
    end

    should "include confirmation validator in data attribute" do
      validator = validators_from("input#foo_seven").first
      assert_equal "confirmation", validator["kind"]
      validator2 = validators_from("input#foo_eight").first
      assert_equal "confirmation", validator2["kind"]
    end
  end

  def validators_from(input_selector)
    form = Nokogiri::HTML(css_select("form[data-error-messages]").first.to_s)
    data_attribute = form.css(input_selector).first["data-validate"]
    JSON.parse(data_attribute)
  end

  def error_messages
    form = Nokogiri::HTML(css_select("form[data-error-messages]").first.to_s)
    data_attribute = form.css("form").first["data-error-messages"]
    JSON.parse(data_attribute)
  end
end
