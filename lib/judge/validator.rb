module Judge

  class Validator

    attr_reader :active_model_validator, :kind, :options, :method, :messages, :original_value

    REJECTED_OPTIONS = [:if, :on, :unless, :tokenizer, :scope, :case_sensitive, :judge]

    def initialize(object, method, amv)
      @kind     = amv.kind
      @options  = amv.options.reject { |key| REJECTED_OPTIONS.include?(key)  }
      @options  = @options.each { |key, value|
        @options[key] = (value.class.name == "Regexp" ? json_regexp(value) : value)
      }
      @method   = method
      @messages = Judge::MessageCollection.new(object, method, amv)
      @original_value    = object.send(method)
    end

    def json_regexp(regexp)
      str = regexp.inspect.
        sub('\\A' , '^').
        sub('\\Z' , '$').
        sub('\\z' , '$').
        sub(/^\// , '').
        sub(/\/[a-z]*$/ , '').
        gsub(/\(\?#.+\)/ , '').
        gsub(/\(\?-\w+:/ , '(').
        gsub(/\s/ , '')
      Regexp.new(str)
    end

    def to_hash
      params = {
        :kind => kind,
        :options => options,
        :messages => messages.to_hash
      }
      params[:original_value] = original_value if kind == :uniqueness
      params
    end

  end

end
