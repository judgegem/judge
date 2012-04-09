require "support/spec_helper"

describe Judge::EachValidator do

  let(:amv) { User.validators_on(:foo).first }

  specify "custom validators include Judge::EachValidator" do
    FooValidator.include?(Judge::EachValidator).should be_true
  end

  specify "#messages_to_lookup method should return array of messages" do
    amv.should respond_to :messages_to_lookup
    amv.messages_to_lookup.should be_an Array
    amv.messages_to_lookup.should include :not_foo
    amv.messages_to_lookup.should include "must_be_a_foo"
  end

end