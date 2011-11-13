class JudgeValidatorTest < Test::Unit::TestCase
  
  context "Judge::Validator" do
    setup do
      user = FactoryGirl.build(:user)
      amv = User.validators_on(:name).first 
      @validator = Judge::Validator.new(amv, :name, Judge::MessageCollection.new(user, :name, amv))
    end

    should "have an original validator in validator attr" do
      assert_instance_of ActiveModel::Validations::PresenceValidator, @validator.active_model_validator
    end

    should "have correct kind attr" do
      assert_equal :presence, @validator.kind
    end

    should "have hash in options attr" do
      assert_kind_of Hash, @validator.options
    end

    should "have Judge::MessageCollection in messages attr" do
      assert_instance_of Judge::MessageCollection, @validator.messages
    end

    context "to_hash" do
      should "convert to hash with correct properties" do
        hash = @validator.to_hash
        assert_kind_of Hash, hash
        assert_kind_of Symbol, hash[:kind]
        assert_kind_of Hash, hash[:options]
        assert_kind_of Hash, hash[:messages]
      end
    end
  end
  
end