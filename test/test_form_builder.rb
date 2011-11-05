require "action_view/test_case"
require "html/document"
require "expected_elements"

class JudgeFormBuilderTest < ActionView::TestCase

	include ExpectedElements

	def builder
		Judge::FormBuilder.new(:user, User.new, self, {}, nil)
	end

	def test_text_field
		assert_dom_equal expected_text_field, builder.text_field(:name, :validate => true)
	end

	def test_text_area
		assert_dom_equal expected_text_area, builder.text_area(:bio, :validate => true)
	end

	def test_password_field
		assert_dom_equal expected_password_field, builder.password_field(:password, :validate => true)
	end

	def test_check_box
		assert_dom_equal expected_check_box, builder.password_field(:accepted, :validate => true)
	end

	def test_radio_button
		assert_dom_equal expected_radio_button, builder.radio_button(:gender, "female", :validate => true)
	end

end