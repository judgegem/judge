module Judge
  class ValidationsController < ActionController::Base
    include Judge::Controller

    def build
      respond_with(validation(params))
    end
  end
end