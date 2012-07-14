module Judge

  class Validation

    attr_accessor :klass, :attribute, :value, :kind
    attr_reader :object, :amv

    def initialize(klass, attribute, value, kind)
      @klass     = klass.constantize
      @attribute = attribute.to_sym
      @value     = value
      @kind      = kind.to_sym
      @object    = build_object
      @amv       = lookup_amv
      validate!
    end

    def errors
      object.errors.get(attribute) || []
    end

    def validate!
      object.errors.delete(attribute)
      amv.validate_each(object, attribute, value)
    end

    def valid?
      errors.empty?
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