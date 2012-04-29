module Judge

  class Validation

    attr_reader :klass, :attribute, :value, :kind, :object, :amv

    def initialize(klass, attribute, value, kind)
      @klass, @attribute, @value, @kind = klass, attribute, value, kind
      @object = build_object
      @amv = lookup_amv
      validate!
    end

    def errors
      object.errors.get(attribute)
    end

    def validate!
      object.errors.delete(attribute)
      amv.validate_each(object, attribute, value)
    end

    def valid?
      validate!
      errors.nil?
    end

    private

    def build_object
      obj = klass.new
      obj[attribute] = value
      obj
    end

    def lookup_amv
      klass.validators_on(attribute).select{ |amv| amv.kind == kind }.first
    end

  end

end