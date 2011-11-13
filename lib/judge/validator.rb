module Judge

  class Validator

    attr_reader :active_model_validator, :kind, :options, :method, :messages

    def initialize(amv, method, message_collection)
      @active_model_validator = amv
      @kind = @active_model_validator.kind
      @options = @active_model_validator.options.reject { |key| [:if, :on, :unless, :tokenizer].include?(key)  }
      @method = method
      @messages = message_collection
    end

    def to_hash
      { :kind => kind, :options => options, :messages => messages.to_hash }
    end

  end

end