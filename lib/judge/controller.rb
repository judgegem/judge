require 'uri'

module Judge
  module Controller

    def self.included(base)
      base.clear_respond_to
      base.respond_to(:json)
    end

    def validation(params)
      params = normalize_validation_params(params)
      if params[:klass] && Judge.config.exposed?(params[:klass], params[:attribute])
        Validation.new(params)
      else
        NullValidation.new(params)
      end
    end

    private

      def normalize_validation_params(params)
        params.keep_if { |key| %w{klass attribute value kind}.include?(key) }
        params[:klass]     = find_klass(params[:klass])
        params[:attribute] = params[:attribute].to_sym
        params[:value]     = URI.decode(params[:value])
        params[:kind]      = params[:kind].to_sym
        params
      end

      def find_klass(name)
        Module.const_get(name.classify)
      rescue NameError
        nil
      end

  end
end