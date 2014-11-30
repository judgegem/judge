require "spec_helper"

describe Judge::EachValidator do

  let(:amv) { User.validators_on(:city).first }

  specify { CityValidator.include?(Judge::EachValidator).should be_truthy }
  specify { amv.should respond_to :messages_to_lookup }
  specify { amv.messages_to_lookup.should be_a Set }
  specify { amv.messages_to_lookup.should include :not_valid_city }
  specify { amv.messages_to_lookup.should include :no_towns }

end
