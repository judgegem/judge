module Judge

  module FieldHelpers

    include ActionView::Helpers::TagHelper
    
    %w{text_field text_area}.each do |type|
      helper = <<-END
        def validated_#{type}(method, options = {})
          options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(options)
          @template.#{type}(self.object_name, method, options)
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def validated_check_box(method, options = {}, checked_value = "1", unchecked_value = "0")
      options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(options)
      @template.check_box(self.object_name, method, objectify_options(options), checked_value, unchecked_value)
    end

    def validated_select(method, choices, options = {}, html_options = {})
      html_options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(html_options)
      @template.select(self.object_name, method, choices, objectify_options(options), @default_options.merge(html_options))
    end

    def validated_collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
      html_options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(html_options)
      @template.collection_select(@object_name, method, collection, value_method, text_method, objectify_options(options), @default_options.merge(html_options))
    end
    
  end

  module FormHelpers
  
    def validated_form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      options[:html] ||= {}
      options[:html]["data-error-messages"] = I18n.t("errors.messages").to_json
      form_for(record_or_name_or_array, *(args << options), &proc)
    end

  end

end
