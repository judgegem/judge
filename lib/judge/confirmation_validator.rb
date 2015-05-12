module Judge
  class ConfirmationValidator

    include Judge::EachValidator

    attr_reader :object, :method, :amv

    def initialize(object, method)
      @object = object
      @method = method
      @amv = amv_from_original
    end

    def kind
      @amv.kind if @amv.present?
    end

    def options
      @amv.options if @amv.present?
    end

    private

    def amv_from_original
      original_amv = nil
      original_method = method.to_s.gsub('_confirmation', '').to_sym
      object.class.validators_on(original_method).each do |v|
        original_amv = v if v.class.name['ConfirmationValidator']
      end

      original_amv
    end

  end
end
