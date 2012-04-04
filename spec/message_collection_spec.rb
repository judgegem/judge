require "spec_helper"

describe Judge::MessageCollection do

  before(:each) do
    @user = FactoryGirl.build(:user)
  end

  it "has hash of messages in messages attr" do
    amv = User.validators_on(:name).first
    message_collection = Judge::MessageCollection.new(@user, :name, amv)
    message_collection.messages.should be_a Hash
  end

  it "has to_hash method which returns messages hash" do
    amv = User.validators_on(:name).first
    message_collection = Judge::MessageCollection.new(@user, :name, amv)
    message_collection.should respond_to :to_hash
    message_collection.to_hash.should be_a Hash
  end

  describe "#generate_base" do
    it "adds correct base message to messages hash" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv)
      msgs = message_collection.send(:generate_base)
      msgs.should be_a Hash
      msgs[:blank].should be_a String
    end
  end

  describe "#generate_options" do
    it "adds correct optional messages to messages hash when present (length)" do
      amv = User.validators_on(:username).first
      message_collection = Judge::MessageCollection.new(@user, :username, amv)
      msgs = message_collection.send(:generate_options)
      msgs.should be_a Hash
      msgs[:too_long].should be_a String
    end

    it "adds correct optional messages to messages hash when present (numericality)" do
      amv = User.validators_on(:age).first
      message_collection = Judge::MessageCollection.new(@user, :age, amv)
      msgs = message_collection.send(:generate_options)
      msgs.should be_a Hash
      msgs[:greater_than].should be_a String
    end

    it "adds nothing to messages hash when optional messages not present" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv)
      msgs = message_collection.send(:generate_options)
      msgs.should be_empty
    end
  end

  describe "#generate_blank" do
    it "adds blank message to messages hash if applicable" do
      amv = User.validators_on(:username).first
      message_collection = Judge::MessageCollection.new(@user, :username, amv)
      msgs = message_collection.send(:generate_blank)
      msgs.should be_a Hash
      msgs[:blank].should be_a String
    end

    it "does not add blank message to messages hash if allow_blank is true" do
      amv = User.validators_on(:country).first
      message_collection = Judge::MessageCollection.new(@user, :country, amv)
      msgs = message_collection.send(:generate_blank)
      msgs.should be_empty
    end
  end

  describe "#generate_integer" do
    it "adds not_an_integer message to messages hash if only_integer is true" do
      amv = User.validators_on(:age).first
      message_collection = Judge::MessageCollection.new(@user, :age, amv)
      msgs = message_collection.send(:generate_integer)
      msgs.should be_a Hash
      msgs[:not_an_integer].should be_a String
    end
  end

end