module Judge
  class ValidationsController < ::ApplicationController
    include Judge::Controller

    def index
      respond_with(validation(params))
    end
  end
end