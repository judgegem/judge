module Judge

  class Validator

    attr_reader :active_model_validator, :kind, :options, :method, :messages

    def initialize(object, method, amv)
      @kind     = amv.kind
      @options  = amv.options.reject { |key| [:if, :on, :unless, :tokenizer].include?(key)  }
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

  end

end