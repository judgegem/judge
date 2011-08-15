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

    should "include allow_blank validation in data attribute" do
      validators = validators_from("input#foo_two_foobar")
      assert validators.first["options"]["allow_blank"]
    end

    should "include length (within range) validation in data attribute" do
      validators = validators_from("input#foo_two_foobar")
      assert_equal "length", validators.first["kind"]
      assert_equal Fixnum, validators.first["options"]["minimum"].class
      assert_equal Fixnum, validators.first["options"]["maximum"].class
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

    should "not include uniqueness validator in data attribute" do
      validators = validators_from("#foo_nine")
      assert_equal 0, validators.select{ |v| v["kind"] == "uniqueness" }.length
    end

  end

  context "validated tag output" do
    setup do
      get :new
      @form = Nokogiri::HTML(css_select("form[data-error-messages]").first.to_s)
    end

    should "do validated_select" do
      assert_equal 1, @form.css("select#foo_one").length
      assert_kind "select#foo_one"
    end

    should "do validated_radio_button" do
      assert_equal 1, @form.css("input#foo_two_foobar").length
      assert_kind "input#foo_two_foobar"
    end

    should "do validated_collection_select" do
      assert_equal 1, @form.css("select#foo_three").length
      assert_kind "select#foo_three"
    end

    should "do validated_text_area" do
      assert_equal 1, @form.css("textarea#foo_four").length
      assert_kind "textarea#foo_four"
    end

    should "do validated_grouped_collection_select" do
      assert_equal 1, @form.css("select#foo_five").length
      assert_kind "select#foo_five"
    end

    should "do validated_check_box" do
      assert_equal 1, @form.css("input#foo_six").length
      assert_kind "input#foo_six"
    end

    should "do validated_text_field" do
      assert_equal 1, @form.css("input#foo_seven").length
      assert_kind "input#foo_seven"
    end

    should "do validated_password_field" do
      assert_equal 1, @form.css("input#foo_eight").length
      assert_kind "input#foo_eight"
    end

    should "do validated_time_zone_select" do
      assert_equal 1, @form.css("select#foo_nine").length
      assert_kind "select#foo_nine"
    end

    should "do validated_time_select" do
      assert_equal 2, @form.css("select[id^=foo_ten]").length
      assert_kind "select[id^=foo_ten]"
    end

    should "do validated_datetime_select" do
      assert_equal 5, @form.css("select[id^=foo_eleven]").length
      assert_kind "select[id^=foo_eleven]"
    end

    should "do validated_date_select" do
      assert_equal 3, @form.css("select[id^=foo_twelve]").length
      assert_kind "select[id^=foo_twelve]"
    end
  
  end

  def validators_from(selector)
    form = Nokogiri::HTML(css_select("form[data-error-messages]").first.to_s)
    data_attribute = form.css(selector).first["data-validate"]
    JSON.parse(data_attribute)
  end

  def error_messages
    form = Nokogiri::HTML(css_select("form[data-error-messages]").first.to_s)
    data_attribute = form.css("form").first["data-error-messages"]
    JSON.parse(data_attribute)
  end

  def assert_kind(selector)
    assert validators_from(selector).first["kind"], "kind of validator not found"
  end

end
