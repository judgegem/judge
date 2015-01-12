require 'uri'

module Judge
  module Controller

    def validation(params)
      params = normalized_params(params)
      if params_present?(params) && params_exposed?(params)
        Validation.new(params)
      else
        NullValidation.new(params)
      end
    end

    private

      REQUIRED_PARAMS = %w{klass attribute value kind original_value}

      def params_exposed?(params)
        Judge.config.exposed?(params[:klass], params[:attribute])
      end

      def params_present?(params)
        params.keys == REQUIRED_PARAMS && params.values.all?
      end

      def normalized_params(params)
        params = params.dup.keep_if {|k| REQUIRED_PARAMS.include?(k) || (k == :original_value && params[:kind] == :uniqueness)}
        params[:klass]     = find_klass(params[:klass]) if params[:klass]
        params[:attribute] = params[:attribute].to_sym  if params[:attribute]
        params[:value]     = URI.decode(params[:value]) if params[:value]
        params[:kind]      = params[:kind].to_sym       if params[:kind]
        params[:original_value] = URI.decode(params[:original_value]) if params[:original_value]
        params
      end

      def find_klass(name)
        Module.const_get(name.classify)
      rescue NameError
        nil
      end

  end
end
