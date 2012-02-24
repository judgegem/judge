require "spec_helper"

describe Judge::ValidatorCollection do
  
  before(:each) do
    user = FactoryGirl.build(:user)
    @validator_collection = Judge::ValidatorCollection.new(user, :name)
  end

  it "contains validators" do
    @validator_collection.validators.should be_an Array
    @validator_collection.validators.first.should be_a Judge::Validator
  end

  it "converts to json correctly" do
    @validator_collection.to_json.should be_a String
  end

end