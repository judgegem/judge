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
      :klass => "User",
      :attribute => "username",
      :value => "invisibleman",
      :kind => "uniqueness"
    }.merge(base_params)
  end

  let(:invalid_params) do
    {
      :klass => "User",
      :attribute => "city",
      :value => "",
      :kind => "city"
    }.merge(base_params)
  end

  describe "GET 'index'" do
    describe "when allowed" do
      before(:each) { Judge.config.stub(:allows?).and_return(true) }
      it "responds with empty JSON array if valid" do
        xhr :get, :index, valid_params, headers
        response.should be_success
        response.body.should eql "[]"
      end
      it "responds with JSON array of error messages if invalid" do
        xhr :get, :index, invalid_params, headers
        response.should be_success
        response.body.should eql "[\"City must be an approved city\"]"
      end
    end
    describe "when not allowed" do
      it "responds with JSON array of error messages if class and attribute are not allowed in Judge config" do
        xhr :get, :index, valid_params, headers
        response.should be_success
        response.body.should eql "[\"Judge validation for User#username not allowed\"]"
      end
    end
  end

end