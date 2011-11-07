class JudgeMessageCollectionTest < Test::Unit::TestCase

  context "Judge::MessageCollection" do
    setup do
      @user = FactoryGirl.build(:user)
    end

    should "have hash of messages in messages attr" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv)
      assert_kind_of Hash, message_collection.messages
    end

    should "have to_hash method which returns messages hash" do
      amv = User.validators_on(:name).first
      message_collection = Judge::MessageCollection.new(@user, :name, amv)
      assert_respond_to message_collection, :to_hash
      assert_kind_of Hash, message_collection.to_hash
    end

    context "#generate_base!" do
      should "add correct base message to messages hash" do
        amv = User.validators_on(:name).first
        message_collection = Judge::MessageCollection.new(@user, :name, amv, :generate => false)
        assert_equal 0, message_collection.to_hash.length
        message_collection.send(:generate_base!)
        assert message_collection.to_hash[:blank]
      end
    end

    context "#generate_options!" do
      should "add correct optional messages to messages hash when present (length)" do
        amv = User.validators_on(:username).first
        message_collection = Judge::MessageCollection.new(@user, :username, amv, :generate => false)
        assert_equal 0, message_collection.to_hash.length
        message_collection.send(:generate_options!)
        assert message_collection.to_hash[:too_long]
      end

      should "add correct optional messages to messages hash when present (numericality)" do
        amv = User.validators_on(:age).first
        message_collection = Judge::MessageCollection.new(@user, :age, amv, :generate => false)
        assert_equal 0, message_collection.to_hash.length
        message_collection.send(:generate_options!)
        assert message_collection.to_hash[:greater_than]
      end

      should "add nothing to messages hash when optional messages not present" do
        amv = User.validators_on(:name).first
        message_collection = Judge::MessageCollection.new(@user, :name, amv, :generate => false)
        message_collection.send(:generate_options!)
        assert_equal 0, message_collection.to_hash.length
      end
    end

    context "#generate_blank!" do
      should "add blank message to messages hash if applicable" do
        amv = User.validators_on(:username).first
        message_collection = Judge::MessageCollection.new(@user, :username, amv, :generate => false)
        assert_equal 0, message_collection.to_hash.length
        message_collection.send(:generate_blank!)
        assert message_collection.to_hash[:blank]
      end

      should "not add blank message to messages hash if allow_blank is true" do
        amv = User.validators_on(:country).first
        message_collection = Judge::MessageCollection.new(@user, :country, amv, :generate => false)
        message_collection.send(:generate_blank!)
        assert_equal 0, message_collection.to_hash.length
      end
    end

    context "#generate_integer!" do
      should "add not_an_integer message to messages hash if only_integer is true" do
        amv = User.validators_on(:age).first
        message_collection = Judge::MessageCollection.new(@user, :age, amv, :generate => false)
        assert_equal 0, message_collection.to_hash.length
        message_collection.send(:generate_integer!)
        assert message_collection.to_hash[:not_an_integer]
      end
    end
  end

end