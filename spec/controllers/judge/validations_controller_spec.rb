require 'spec_helper'

describe Judge::ValidationsController, type: :controller do

  let(:headers) do
    { :accept => "application/json" }
  end

  let(:valid_params) do
    {
      :use_route => :judge,
      :format => :json,
      :klass => "User",
      :attribute => "username",
      :value => "tinbucktwo",
      :kind => "uniqueness",
      :original_value => "tinbucktwo"
    }
  end

  let(:invalid_params) do
    {
      :use_route => :judge,
      :format => :json,
      :klass => "User",
      :attribute => "city",
      :value => "",
      :kind => "city",
      :original_value => "nil"
    }
  end

  describe "GET 'build'" do
    describe "when allowed" do
      before(:each) { Judge.config.stub(:exposed?).and_return(true) }
      it "responds with empty JSON array if valid" do
        get :build, valid_params, headers
        response.should be_success
        response.body.should eql "[]"
      end
      it "responds with empty JSON array if original_value equals the value" do
        FactoryGirl.create(:user, username: 'tinbucktwo')
        get :build, valid_params, headers
        response.should be_success
        response.body.should eql "[]"
      end
      it "responds with JSON array of error messages if invalid" do
        get :build, invalid_params, headers
        response.should be_success
        response.body.should eql "[\"City must be an approved city\"]"
      end
    end
    describe "when not allowed" do
      it "responds with JSON array of error messages if class and attribute are not allowed in Judge config" do
        get :build, valid_params, headers
        response.should be_success
        response.body.should eql "[\"Judge validation for User#username not allowed\"]"
      end
    end
  end

  describe "#validation" do
    let(:controller) { Judge::ValidationsController.new }
    let(:params) { valid_params.with_indifferent_access }
    describe "when params allowed" do
      before(:each) { Judge.config.stub(:exposed?).and_return(true) }
      it "returns a Validation object" do
        controller.validation(params).should be_a Judge::Validation
      end
    end

    describe "when params not allowed" do
      it "returns a NullValidation object" do
        controller.validation(params).should be_a Judge::NullValidation
      end
    end
  end

end
