module Judge
  class ValidationsController < ::ApplicationController
    respond_to :json

    def index
      respond_with(Judge.build_validation(params))
    end
  end
end
