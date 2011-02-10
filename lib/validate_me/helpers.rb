module ValidateMe

  module Helpers

    include ActionView::Helpers::TagHelper
    
    def validated_text_field(method, options = {})
      validators = self.object.class.validators_on(method).collect{ |v| { :kind => v.kind.to_s, :options => v.options } }
      options = { "data-validate" => validators.to_json }.merge(options)
      @template.text_field(self.object_name, method, options)
    end

  end

end
