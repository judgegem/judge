require 'spec_helper'

describe Judge::Config do

  before(:each) do
    class User; end
    class Role; end
  end

  after(:each) do
    Judge.configure do
      unexpose User
    end
  end

  describe ".configure" do
    describe "expose" do
      it "adds attributes to allowed hash" do
        Judge.configure do
          expose User, :username, :email
        end
        Judge.config.exposed[User].should eql [:username, :email]
      end

      it "accepts multiple declarations for the same class" do
        Judge.configure do
          expose User, :username
          expose User, :username, :email
        end
        Judge.config.exposed[User].length.should eq 2
      end
    end
    describe "unexpose" do
      before(:each) do
        Judge.configure do
          expose User, :username, :email
        end
      end
      it "removes exposed attributes" do
        Judge.configure do
          unexpose User, :email
        end
        Judge.config.exposed[User].length.should eq 1
      end
      it "removes whole class when no attributes given" do
        Judge.configure do
          unexpose User
        end
        Judge.config.exposed.should_not include User
      end
      it "removes class when final attribute removed" do
        Judge.configure do
          unexpose User, :username, :email
        end
        Judge.config.exposed.should_not include User
      end
    end
  end

  describe ".config" do
    describe ".exposed?" do
      before(:each) do
        Judge.configure do
          expose User, :username
        end
      end
      it "returns true if constant and attribute are present in allowed hash" do
        Judge.config.exposed?(User, :username).should be_truthy
      end
      it "returns false otherwise" do
        Judge.config.exposed?(User, :foo).should be_falsy
        Judge.config.exposed?(Role, :foo).should be_falsy
      end
    end
  end

end
