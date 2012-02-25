module Judge

  module HTML

    extend self

    def attrs_for(object, method)
      { "data-validate" => Judge::ValidatorCollection.new(object, method).to_json }
    end

  end

end