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

  describe "#generate_base!" do
    it "adds correct base message to messages hash" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv, :generate => false)
      message_collection.to_hash.should be_empty
      message_collection.send(:generate_base!)
      message_collection.to_hash[:blank].should be_a String
    end
  end

  describe "#generate_options!" do
    it "adds correct optional messages to messages hash when present (length)" do
      amv = User.validators_on(:username).first
      message_collection = Judge::MessageCollection.new(@user, :username, amv, :generate => false)
      message_collection.to_hash.should be_empty
      message_collection.send(:generate_options!)
      message_collection.to_hash[:too_long].should be_a String
    end

    it "adds correct optional messages to messages hash when present (numericality)" do
      amv = User.validators_on(:age).first
      message_collection = Judge::MessageCollection.new(@user, :age, amv, :generate => false)
      message_collection.to_hash.should be_empty
      message_collection.send(:generate_options!)
      message_collection.to_hash[:greater_than].should be_a String
    end

    it "adds nothing to messages hash when optional messages not present" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv, :generate => false)
      message_collection.send(:generate_options!)
      message_collection.to_hash.should be_empty
    end
  end

  describe "#generate_blank!" do
    it "adds blank message to messages hash if applicable" do
      amv = User.validators_on(:username).first
      message_collection = Judge::MessageCollection.new(@user, :username, amv, :generate => false)
      message_collection.to_hash.should be_empty
      message_collection.send(:generate_blank!)
      message_collection.to_hash[:blank].should be_a String
    end

    it "does not add blank message to messages hash if allow_blank is true" do
      amv = User.validators_on(:country).first
      message_collection = Judge::MessageCollection.new(@user, :country, amv, :generate => false)
      message_collection.send(:generate_blank!)
      message_collection.to_hash.should be_empty
    end
  end

  describe "#generate_integer!" do
    it "adds not_an_integer message to messages hash if only_integer is true" do
      amv = User.validators_on(:age).first
      message_collection = Judge::MessageCollection.new(@user, :age, amv, :generate => false)
      message_collection.to_hash.should be_empty
      message_collection.send(:generate_integer!)
      message_collection.to_hash[:not_an_integer].should be_a String
    end
  end

end