module Judge
  class ValidationsController < ::ApplicationController

    respond_to :json

    def perform
      validation = Judge::Validation.new(params[:class], params[:attribute], params[:value], params[:kind])
      respond_with(validation.errors)
    end

  end
end
