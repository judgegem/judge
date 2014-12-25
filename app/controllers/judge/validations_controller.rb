module Judge
  class ValidationsController < ActionController::Base
    include Judge::Controller

    def build
      render json: validation(params)
    end
  end
end
