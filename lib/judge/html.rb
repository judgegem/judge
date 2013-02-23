module Judge
  module Html
    extend self
    
    def attrs_for(object, method)
      {
        "data-validate" => ValidatorCollection.new(object, method).to_json
      }
    end
  end
end