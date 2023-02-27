class Discipline < ActiveRecord::Base
  belongs_to :sport
  belongs_to :user

  validates :sport, presence: true
end