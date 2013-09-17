module Judge

  class ValidatorCollection

    include Enumerable

    attr_reader :validators
    
    def initialize(object, method)
      amvs = object.class.validators_on(method)
      amvs = amvs.reject { |amv| reject?(amv) }
      amvs = amvs.reject { |amv| unsupported_options?(amv) && reject?(amv) != false } if Judge.config.ignore_unsupported_validators?
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
        amv.options[:judge] == :ignore ? true : false
      end

  end

end