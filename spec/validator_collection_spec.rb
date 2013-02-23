require "spec_helper"

describe Judge::ValidatorCollection do
  
  let(:vc) { Judge::ValidatorCollection.new(FactoryGirl.build(:user), :name) }

  it "contains validators" do
    vc.validators.should be_an Array
    vc.validators.first.should be_a Judge::Validator
  end

  it "converts to json correctly" do
    vc.to_json.should be_a String
  end

  it "is enumerable" do
    vc.should be_an Enumerable
    vc.should respond_to :each
  end

end