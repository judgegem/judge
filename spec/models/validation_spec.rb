require 'spec_helper'

describe "validations" do

  before(:all) do
    FactoryGirl.create(:user, :username => "existing")
  end
  let(:valid_params) do
    {
      :klass => "User",
      :attribute => "username",
      :value => "new",
      :kind => "uniqueness"
    }.with_indifferent_access
  end
  let(:invalid_params) do
    {
      :klass => "User",
      :attribute => "username",
      :value => "existing",
      :kind => "uniqueness"
    }.with_indifferent_access
  end
  after(:all) { User.destroy_all }

  describe Judge::Validation do
    describe "with valid value" do
      subject(:validation) { Judge::Validation.new(valid_params) }
      specify { validation.amv.should be_a ActiveRecord::Validations::UniquenessValidator }
      specify do
        validation.record.should be_a User
        validation.record.username.should eql "new"
      end
      specify do 
        validation.as_json.should be_an Array
        validation.as_json.should be_empty
      end
    end

    describe "with invalid value" do
      subject(:validation) { Judge::Validation.new(invalid_params) }
      it { should be_a Judge::Validation }
      specify { validation.as_json.should eql ["Username \"existing\" has already been taken"] }
    end
  end

  describe Judge::NullValidation do
    subject(:validation) { Judge::NullValidation.new(valid_params) }
    it "does not build object" do
      validation.record.should eql validation
    end
    it "does not look up active model validator" do
      validation.amv.should eql validation
    end
    specify { validation.as_json.should eql ["Judge validation for User#username not allowed"] }
  end

end