module Judge

  class FormBuilder < ActionView::Helpers::FormBuilder
    
    %w{text_field text_area password_field}.each do |type|
      helper = <<-END
        def #{type}(method, options = {})
          if options.delete(:validate).present?
            options = Judge::HTML.attrs_for(self.object, method).merge(options)
          end
          super
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def radio_button(method, tag_value, options = {})
      if options.delete(:validate).present?
        options = Judge::HTML.attrs_for(self.object, method).merge(options)
      end
      super
    end
    
    def check_box(method, options = {}, checked_value = "1", unchecked_value = "0")
      if options.delete(:validate).present?
        options = Judge::HTML.attrs_for(self.object, method).merge(options)
      end
      super
    end

    def select(method, choices, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = Judge::HTML.attrs_for(self.object, method).merge(html_options)
      end
      super
    end

    def collection_select(method, collection, value_method, text_method, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = Judge::HTML.attrs_for(self.object, method).merge(html_options)
      end
      super
    end

    def grouped_collection_select(method, collection, group_method, group_label_method, option_key_method, option_value_method, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = Judge::HTML.attrs_for(self.object, method).merge(html_options)
      end
      super
    end

    %w{date_select datetime_select time_select}.each do |type|
      helper = <<-END
        def #{type}(method, options = {}, html_options = {})
          if options.delete(:validate).present?
            html_options = Judge::HTML.attrs_for(self.object, method).merge(html_options)
          end
          super
        end
      END
      class_eval helper, __FILE__, __LINE__
    end

    def time_zone_select(method, priority_zones = nil, options = {}, html_options = {})
      if options.delete(:validate).present?
        html_options = Judge::HTML.attrs_for(self.object, method).merge(html_options)
      end
      super
    end
    
  end

end
