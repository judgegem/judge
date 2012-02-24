require "spec_helper"

describe Judge::Validator do
  
  before(:each) do
    user = FactoryGirl.build(:user)
    amv = User.validators_on(:name).first 
    @validator = Judge::Validator.new(amv, :name, Judge::MessageCollection.new(user, :name, amv))
  end

  it "has an original validator in validator attr" do
    @validator.active_model_validator.should be_a ActiveModel::Validations::PresenceValidator
  end

  it "has correct kind attr" do
    @validator.kind.should eql :presence
  end

  it "has hash in options attr" do
    @validator.options.should be_a Hash
  end

  it "has Judge::MessageCollection in messages attr" do
    @validator.messages.should be_a Judge::MessageCollection
  end

  describe "#to_hash" do
    it "converts to hash with correct properties" do
      hash = @validator.to_hash
      hash.should be_a Hash
      hash[:kind].should be_a Symbol
      hash[:options].should be_a Hash
      hash[:messages].should be_a Hash
    end
  end
  
end