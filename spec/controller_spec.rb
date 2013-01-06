require 'active_support/hash_with_indifferent_access'
require 'spec_helper'

describe Judge::Controller do

  let(:controller) do
    class UsersController < ActionController::Base
      include Judge::Controller
    end
    UsersController.new
  end

  let(:params) do
    {
      :klass => "User",
      :attribute => "username",
      :value => "foo",
      :kind => "uniqueness",
    }.with_indifferent_access
  end

  

end