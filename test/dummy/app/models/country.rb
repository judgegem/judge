class Country < ActiveRecord::Base
  belongs_to :continent
  has_many :cities
end


