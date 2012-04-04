module Judge

  class ValidatorCollection

    include Enumerable

    attr_reader :validators
    
    def initialize(object, method)
      amvs = object.class.validators_on(method).reject { |amv| amv.kind == :uniqueness }
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

  end

end