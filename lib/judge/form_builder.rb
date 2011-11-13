module Judge

  class FormBuilder < ActionView::Helpers::FormBuilder

    #include ActionView::Helpers::TagHelper
    
    %w{text_field text_area password_field}.each do |type|
      helper = <<-END
        def #{type}(method, options = {})
          if options.delete(:validate).present?
            options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(options)
          end
          @template.#{type}(self.object_name, method, options)
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def radio_button(method, tag_value, options = {})
      if options.delete(:validate).present?
        options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(options)
      end
      @template.radio_button(@object_name, method, tag_value, objectify_options(options))
    end
    
    def check_box(method, options = {}, checked_value = "1", unchecked_value = "0")
      if options.delete(:validate).present?
        options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(options)
      end
      @template.check_box(self.object_name, method, objectify_options(options), checked_value, unchecked_value)
    end

    def select(method, choices, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(html_options)
      end
      @template.select(self.object_name, method, choices, objectify_options(options), @default_options.merge(html_options))
    end

    def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(html_options)
      end
      @template.collection_select(self.object_name, method, collection, value_method, text_method, objectify_options(options), @default_options.merge(html_options))
    end

    def grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(html_options)
      end
      @template.grouped_collection_select(self.object_name, method, collection, group_method, group_label_method, option_key_method, option_value_method, objectify_options(options), @default_options.merge(html_options))
    end

    %w{date_select datetime_select time_select}.each do |type|
      helper = <<-END
        def #{type}(method, options = {}, html_options = {})
          if options.delete(:validate).present?
            html_options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(html_options)
          end
          @template.#{type}(self.object_name, method, objectify_options(options), html_options)
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = { "data-validate" => Judge::ValidatorCollection.new(self.object, method).to_json }.merge(html_options)
      end
      @template.time_zone_select(@object_name, method, priority_zones, objectify_options(options), @default_options.merge(html_options))
    end
    
  end

end
