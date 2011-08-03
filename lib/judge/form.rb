module Judge

  module FormBuilder

    include ActionView::Helpers::TagHelper
    
    %w{text_field text_area password_field}.each do |type|
      helper = <<-END
        def validated_#{type}(method, options = {})
          options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(options)
          @template.#{type}(self.object_name, method, options)
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def validated_radio_button(method, tag_value, options = {})
      options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(options)
      @template.radio_button(@object_name, method, tag_value, objectify_options(options))
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
      @template.collection_select(self.object_name, method, collection, value_method, text_method, objectify_options(options), @default_options.merge(html_options))
    end

    def validated_grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      html_options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(html_options)
      @template.grouped_collection_select(self.object_name, method, collection, group_method, group_label_method, option_key_method, option_value_method, objectify_options(options), @default_options.merge(html_options))
    end

    %w{date_select datetime_select time_select}.each do |type|
      helper = <<-END
        def validated_#{type}(method, options = {}, html_options = {})
          html_options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(html_options)
          @template.#{type}(self.object_name, method, objectify_options(options), html_options)
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def validated_time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
      html_options = { "data-validate" => Judge::Utils.jsonify_validators(self.object, method) }.merge(html_options)
      @template.time_zone_select(@object_name, method, priority_zones, objectify_options(options), @default_options.merge(html_options))
    end
    
    
  end

  module FormHelper
  
    def validated_form_for(record_or_name_or_array, *args, &proc)
      options = args.extract_options!
      options[:html] ||= {}
      options[:html]["data-error-messages"] = I18n.t("errors.messages").to_json
      form_for(record_or_name_or_array, *(args << options), &proc)
    end

  end

end
