module Judge
  class ValidationsController < ::ApplicationController
    include Judge::Controller

    def build
      respond_with(validation(params))
    end
  end
end