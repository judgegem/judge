require "spec_helper"

describe Judge::ConfirmationValidator do

  let :password_confirmation  do
    user = FactoryGirl.build(:user)
    Judge::ConfirmationValidator.new(user, :password_confirmation)
  end

  describe '#amv' do
    it "should return a ConfirmationValidator" do
      expect(password_confirmation.amv).to be_a(ActiveModel::Validations::ConfirmationValidator)
    end

    it "should be the ConfirmationValidator from :password" do
      expect(password_confirmation.amv.attributes).to include(:password)
    end
  end

  describe '#kind' do
    it "should return the the original amv's kind (:confiramtion)" do
      expect(password_confirmation.kind).to eq(:confirmation)
      expect(password_confirmation.kind).to eq(password_confirmation.amv.kind)
    end
  end

  describe '#options' do
    it "should return the original amv's options (an empty hash)" do
      expect(password_confirmation.options).to eq({})
      expect(password_confirmation.options).to eq(password_confirmation.amv.options)
    end
  end

end
