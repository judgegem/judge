require "spec_helper"

describe Judge::Validation do

  before(:all) { FactoryGirl.create(:user, :username => "existing") }
  let(:validation_fail) { Judge::Validation.new("User", "username", "existing", "uniqueness") }
  let(:validation_succeed) { Judge::Validation.new("User", "username", "new", "uniqueness") }
  after(:all) { User.destroy_all }

  specify "#object" do
    validation_fail.object.should be_a User
    validation_fail.object.username.should eql "existing"
  end

  describe "#errors" do

    specify "when value is valid" do
      validation_succeed.errors.should be_an Array
      validation_succeed.errors.should be_empty
    end

    specify "when value is invalid" do
      validation_fail.errors.should be_an Array
      validation_fail.errors.length.should eql 1
      validation_fail.errors.first.should eql "Username \"existing\" has already been taken"
    end

  end

  describe "#valid?" do

    specify "when value is valid" do
      validation_succeed.valid?.should eql true
    end

    specify "when value is invalid" do
      validation_fail.valid?.should eql false
    end

  end

end