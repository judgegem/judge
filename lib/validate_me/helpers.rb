module ValidateMe

  module Helpers

    include ActionView::Helpers::TagHelper
    
    def validated_text_field(method, options = {})
      object_name = self.object_name
      validators = self.object.class.validators_on(method).collect{ |v| { :kind => v.kind.to_s, :options => v.options } }
      options = { "data-validate" => validators.to_json }.merge(options)
      @template.text_field(object_name, method, options)
    end

  end

end
