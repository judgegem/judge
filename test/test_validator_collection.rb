class JudgeValidatorCollection < Test::Unit::TestCase
  
  context "Judge::ValidatorCollection" do
    setup do
      user = FactoryGirl.build(:user)
      @validator_collection = Judge::ValidatorCollection.new(user, :name)
    end

    should "contain validators" do
      assert_kind_of Array, @validator_collection.validators
      assert_instance_of Judge::Validator, @validator_collection.validators.first
    end

    should "convert to json correctly" do
      assert_kind_of String, @validator_collection.to_json
    end
  end

end