class CityValidator < ActiveModel::EachValidator
  declare_messages :not_valid_city

  def validate_each(record, attribute, value)
    unless ["London", "New York City"].include? value
      record.errors.add :attribute, :not_valid_city
    end
  end
end