require "support/spec_helper"

describe Judge::EachValidator do

  let(:amv) { User.validators_on(:city).first }

  specify "custom validators include Judge::EachValidator" do
    CityValidator.include?(Judge::EachValidator).should be_true
  end

  specify "#messages_to_lookup method should return array of messages" do
    amv.should respond_to :messages_to_lookup
    amv.messages_to_lookup.should be_an Array
    amv.messages_to_lookup.should include :not_valid_city
  end

end