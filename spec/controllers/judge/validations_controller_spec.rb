require "spec_helper"

describe Judge::ValidationsController do

  let(:base_params) do
    { :use_route => :judge }
  end

  let(:headers) do
    { :accept => "application/json" }
  end
  
  let(:valid_params) do
    {
      :class => "User",
      :attribute => "username",
      :value => "invisibleman",
      :kind => "uniqueness"
    }.merge(base_params)
  end

  let(:invalid_params) do
    {
      :class => "User",
      :attribute => "city",
      :value => "",
      :kind => "city"
    }.merge(base_params)
  end

  describe "perform" do

    it "responds with empty array if valid" do
      xhr :get, :perform, valid_params, headers
      response.should be_success
      response.body.should eql "[]"
    end

    it "responds with array of error messages if invalid" do
      xhr :get, :perform, invalid_params, headers
      response.should be_success
      response.body.should eql "[\"City must be an approved city\"]"
    end

  end

end