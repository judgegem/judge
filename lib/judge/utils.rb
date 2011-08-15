module Judge
  module Utils

    def self.jsonify_validators(object, method)
      validators = object.class.validators_on(method)
      validators = validators.collect do |validator|
        {
          :kind => validator.kind.to_s, 
          :options => validator.options.reject{ |key| [:if, :on, :unless, :tokenizer].include?(key)  }
        }
      end
      validators.reject{ |validator| validator[:kind] == "uniqueness" }.to_json
    end

  end
end
