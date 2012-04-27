class Sport < ActiveRecord::Base
  belongs_to :category
  has_many :disciplines
end