module Judge

  class ValidatorCollection

    include Enumerable

    attr_reader :validators
    
    def initialize(object, method)
      amvs = object.class.validators_on(method).reject { |amv| unsupported_options?(amv) }
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
        (amv.options.keys & UNSUPPORTED_OPTIONS).length == 1 && amv.options[:case_sensitive] == false
      end

  end

end