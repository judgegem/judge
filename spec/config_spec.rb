require 'spec_helper'

describe Judge::Config do

  before(:each) do
    class User; end
    class Role; end
  end

  after(:each) do
    Judge.configure do
      disallow User
    end
  end

  describe ".configure" do
    describe "allow" do
      it "adds attributes to allowed hash" do
        Judge.configure do
          allow User, :username, :email
        end
        Judge.config.allowed[User].should eql [:username, :email]
      end

      it "accepts multiple declarations for the same class" do
        Judge.configure do
          allow User, :username
          allow User, :username, :email
        end
        Judge.config.allowed[User].should have(2).attributes
      end
    end
    describe "disallow" do
      before(:each) do
        Judge.configure do
          allow User, :username, :email
        end
      end
      it "removes allowed attributes" do
        Judge.configure do
          disallow User, :email
        end
        Judge.config.allowed[User].should have(1).attribute
      end
      it "removes whole class when no attributes given" do
        Judge.configure do
          disallow User
        end
        Judge.config.allowed.should_not include User
      end
      it "removes class when final attribute removed" do
        Judge.configure do
          disallow User, :username, :email
        end
        Judge.config.allowed.should_not include User
      end
    end
  end

  describe ".config" do
    describe ".allows?" do
      before(:each) do
        Judge.configure do
          allow User, :username
        end
      end
      it "returns true if constant and attribute are present in allowed hash" do
        Judge.config.allows?(User, :username).should be_true
      end
      it "returns false otherwise" do
        Judge.config.allows?(User, :foo).should be_false
        Judge.config.allows?(Role, :foo).should be_false
      end
    end
  end

end