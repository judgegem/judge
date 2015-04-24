module Judge

  class ValidatorCollection

    include Enumerable

    attr_reader :validators, :object, :method

    def initialize(object, method)
      @object = object
      @method = method
      @validators = amvs.map { |amv| Judge::Validator.new(object, method, amv) }
    end

    def each(&block)
      validators.each do |v|
        block.call(v)
      end
    end

    def to_json
      validators.map { |v| v.to_hash }.to_json
    end

    protected

      UNSUPPORTED_OPTIONS = [:if, :on, :unless, :tokenizer, :scope, :case_sensitive]

      # returns an array of ActiveModel::Validations
      # starts with all Validations attached to method and removes one that are:
      #   ignored based on a config
      #   ConfirmationValidators, which are moved directly to the confirmation method
      #   unsupported by Judge
      # if it's a confirmation field, an AM::V like class is added to handle the confirmation validations
      def amvs
        amvs = object.class.validators_on(method)
        amvs = amvs.reject { |amv| reject?(amv) || amv.class.name['ConfirmationValidator'] }
        amvs = amvs.reject { |amv| unsupported_options?(amv) && reject?(amv) != false } if Judge.config.ignore_unsupported_validators?
        amvs << Judge::ConfirmationValidator.new(object, method) if is_confirmation?

        amvs
      end

      def unsupported_options?(amv)
        unsupported = !(amv.options.keys & UNSUPPORTED_OPTIONS).empty?
        return false unless unsupported
        # Apparently, uniqueness validations always have the case_sensitive option, even
        # when it is not explicitly used (in which case it has value true). Hence, we only
        # report the validation as unsupported when case_sensitive is set to false.
        unsupported = amv.options.keys & UNSUPPORTED_OPTIONS
        unsupported.length > 1 || unsupported != [:case_sensitive] || amv.options[:case_sensitive] == false
      end

      # decides whether to reject a validation based on the presence of the judge option.
      # return values:
      #   true  when :judge => :ignore is present in the options
      #   false when :judge => :force is present
      #   nil otherwise (e.g. when no :judge option or an unknown option is present)
      def reject?(amv)
        return unless [:force, :ignore].include?( amv.options[:judge] )
        amv.options[:judge] == :ignore
      end

      def is_confirmation?
        method.to_s['_confirmation']
      end

  end

end