class CityValidator < ActiveModel::EachValidator
  uses_messages :not_valid_city
  uses_messages :no_towns

  def validate_each(record, attribute, value)
    unless ["London", "New York City"].include? value
      record.errors.add attribute, :not_valid_city
    end
    record.errors.add(attribute, :no_towns) if value == "Ipswich"
  end
end