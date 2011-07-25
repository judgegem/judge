class Continent < ActiveRecord::Base
  has_many :countries
end

