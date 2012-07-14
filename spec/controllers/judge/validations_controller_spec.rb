require "spec_helper"

describe Judge::ValidationsController do

  let(:base_params) do
    {
      :use_route => :judge,
      :format => :json
    }
  end
  
  let(:valid_params) do
    {
      :class => "User",
      :attribute => "username",
      :value => "invisibleman",
      :kind => "uniqueness"
    }
  end

  let(:invalid_params) do
    {
      :class => "User",
      :attribute => "city",
      :value => "",
      :kind => "city"
    }
  end

  describe "GET 'perform'" do

    it "responds with empty array if valid" do
      get :perform, valid_params.merge(base_params)
      response.should be_success
      response.body.should eql "[]"
    end

    it "responds with array of error messages if invalid" do
      get :perform, invalid_params.merge(base_params)
      response.should be_success
      response.body.should eql "[\"City must be an approved city\"]"
    end

  end

end