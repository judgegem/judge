module Judge

  class ValidatorCollection

    include Enumerable

    attr_reader :validators
    
    def initialize(object, method)
      active_model_validators = object.class.validators_on(method).reject { |amv| amv.kind == :uniqueness }
      @validators = active_model_validators.map do |amv|
        Judge::Validator.new(amv, method, Judge::MessageCollection.new(object, method, amv))
      end
    end

    def each(&block)
      validators.each do |v|
        block.call(v)
      end
    end

    def to_json
      validators.map { |v| v.to_hash }.to_json
    end

  end

end