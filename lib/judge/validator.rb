module Judge

  class Validator

    attr_reader :active_model_validator, :kind, :options, :method, :messages

    def initialize(object, method, amv)
      @kind     = amv.kind
      @options  = set_options(amv.options)
      @method   = method
      @messages = Judge::MessageCollection.new(object, method, amv)
    end

    def to_hash
      {
        :kind => kind,
        :options => options,
        :messages => messages.to_hash
      }
    end

  private

    def set_options(options)
      options     = options.reject { |key| [:if, :on, :unless, :tokenizer].include?(key)  }
      method_name = "get_js_compatible_#{self.kind}"
      if self.respond_to? method_name, options
        options = self.send method_name, options
      end
      options
    end

    def get_js_compatible_format(options)
      format_options = Hash.new
      options.each do |key, option|
        format_options[key] = (key == :with) ? convert_regex_to_js_compatible(option) : option
      end
      format_options
    end

    def convert_regex_to_js_compatible(regex)
      js_regex_source = regex.source.sub(/^\\A/, '^').sub(/\\z$/i, '$')
      /#{js_regex_source}/
    end

  end

end
