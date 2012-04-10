require "support/spec_helper"

describe Judge::MessageCollection do

  let(:user) { FactoryGirl.build(:user) }

  it "has to_hash method which returns messages hash" do
    amv = User.validators_on(:name).first
    message_collection = Judge::MessageCollection.new(user, :name, amv)
    message_collection.should respond_to :to_hash
    message_collection.to_hash.should be_a Hash
  end

  describe "base messages" do
    it "adds correct base message to messages hash" do
      amv = User.validators_on(:name).first
      messages = Judge::MessageCollection.new(user, :name, amv).to_hash
      messages[:blank].should eql "Name must not be blank"
    end
  end

  describe "options messages" do
    it "adds correct optional messages to messages hash when present (length)" do
      amv = User.validators_on(:username).first
      messages = Judge::MessageCollection.new(user, :username, amv).to_hash
      messages[:too_long].should eql "Username is too long (must be less than 10 characters)"
    end

    it "adds correct optional messages to messages hash when present (numericality)" do
      amv = User.validators_on(:age).first
      messages = Judge::MessageCollection.new(user, :age, amv).to_hash
      messages[:greater_than].should eql "Age must be greater than 13"
    end

    it "adds nothing to messages hash when optional messages not present" do
      amv = User.validators_on(:name).first
      messages = Judge::MessageCollection.new(user, :name, amv).to_hash
      messages[:too_long].should be_nil
      messages[:greater_than].should be_nil
    end
  end

  describe "blank messages" do
    it "adds blank message to messages hash if applicable" do
      amv = User.validators_on(:username).first
      messages = Judge::MessageCollection.new(user, :username, amv).to_hash
      messages[:blank].should eql "Username must not be blank"
    end

    it "does not add blank message to messages hash if allow_blank is true" do
      amv = User.validators_on(:country).first
      messages = Judge::MessageCollection.new(user, :country, amv).to_hash
      messages[:blank].should be_nil
    end
  end

  describe "integer messages" do
    it "adds not_an_integer message to messages hash if only_integer is true" do
      amv = User.validators_on(:age).first
      messages = Judge::MessageCollection.new(user, :age, amv).to_hash
      messages[:not_an_integer].should eql "Age must be an integer"
    end
  end

  describe "custom messages" do
    it "adds custom messages to messages hash if declared inside EachValidator" do
      amv = User.validators_on(:city).first
      messages = Judge::MessageCollection.new(user, :city, amv).to_hash
      messages[:not_valid_city].should eql "City must be an approved city"
    end
  end

end