require "spec_helper"

describe Judge::HTML do
  
  let(:object) { FactoryGirl.build(:user) }
  let(:method) { :name }

  specify "#attrs_for" do
    attrs = Judge::HTML.attrs_for(object, method)
    attrs.should be_a Hash
    attrs["data-validate"].should be_a String
  end

end