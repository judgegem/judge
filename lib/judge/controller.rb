module Judge
  module Controller

    def self.included(base)
      base.clear_respond_to
      base.respond_to(:json)
    end

    def validation(params)
      params.keep_if { |key| %w{klass attribute value kind}.include?(key) }
      if Judge.config.allows?(params[:klass], params[:attribute])
        Validation.new(params)
      else
        NullValidation.new(params)
      end
    end
    
  end
end