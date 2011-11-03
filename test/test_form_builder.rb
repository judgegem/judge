require "action_view/test_case"

class JudgeFormBuilderTest < ActionView::TestCase

	def setup
		@user = User.new
		@builder = Judge::FormBuilder.new(:user, @user, self, {}, nil)
	end

	def test_text_field
		assert_equal @builder.text_field(:name, :validate => true), "t"
	end

end