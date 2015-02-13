module Judge

  class FormBuilder < ActionView::Helpers::FormBuilder

    include Judge::Html

    %w{text_field text_area password_field email_field number_field phone_field range_field search_field telephone_field url_field file_field}.each do |type|
      helper = <<-END
        def #{type}(method, options = {})
          add_validate_attr!(self.object, method, options)
          super
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def radio_button(method, tag_value, options = {})
      add_validate_attr!(self.object, method, options)
      super
    end

    def check_box(method, options = {}, checked_value = "1", unchecked_value = "0")
      add_validate_attr!(self.object, method, options)
      super
    end

    def select(method, choices, options = {}, html_options = {})
      add_validate_attr!(self.object, method, options, html_options)
      super
    end

    def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
      add_validate_attr!(self.object, method, options, html_options)
      super
    end

    def grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      add_validate_attr!(self.object, method, options, html_options)
      super
    end

    %w{date_select datetime_select time_select}.each do |type|
      helper = <<-END
        def #{type}(method, options = {}, html_options = {})
          add_validate_attr!(self.object, method, options, html_options)
          super
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
      add_validate_attr!(self.object, method, options, html_options)
      super
    end

    private

      def add_validate_attr!(object, method, options, html_options = nil)
        options_to_merge = html_options || options
        if options.delete(:validate)
          options_to_merge.merge! attrs_for(object, method)
        end
      end

  end

end
