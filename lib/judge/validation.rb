module Judge

  class Validation
    def initialize(params)
      @klass     = params[:klass]
      @attribute = params[:attribute]
      @value     = params[:value]
      @kind      = params[:kind]
      @original_value = params[:original_value]
      validate!
    end

    def amv
      @amv ||= begin
        validators = @klass.validators_on(@attribute)
        validators.keep_if { |amv| amv.kind == @kind }
        validators.first
      end
    end

    def record
      @record ||= begin
        rec = @klass.new
        rec[@attribute] = @value
        rec
      end
    end

    def validate!
      record.errors.delete(@attribute)
      amv.validate_each(record, @attribute, @value) unless amv.kind == :uniqueness && @value == @original_value && @original_value != ""
      self
    end

    def as_json(options = {})
      record.errors[@attribute] || []
    end
  end

  class NullValidation
    def initialize(params)
      @params = params
    end

    def as_json(options = {})
      ["Judge validation for #{@params[:klass]}##{@params[:attribute]} not allowed"]
    end

    def method_missing(*args)
      self
    end
  end

end
