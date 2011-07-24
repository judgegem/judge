module Judge
  module Utils

    def self.jsonify_validators(object, method)
      object
        .class
        .validators_on(method)
        .collect{ |v| { :kind => v.kind.to_s, :options => v.options } }
        .to_json
    end

  end
end
