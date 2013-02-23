class User < ActiveRecord::Base
  belongs_to :team
  belongs_to :discipline

  validates :name,          :presence => true
  validates :username,      :length => { :maximum => 10 }, :uniqueness => true
  validates :country,       :format => { :with => /[A-Za-z]/, :allow_blank => true }
  validates :age,           :numericality => { :only_integer => true, :greater_than => 13 }
  validates :bio,           :presence => true
  validates :password,      :format => { :with => /.+/ }, :confirmation => true
  validates :accepted,      :acceptance => true
  validates :gender,        :inclusion => { :in => ["male", "female", "other", "withheld"] }
  validates :dob,           :presence => true
  validates :team_id,       :presence => true
  validates :time_zone,     :presence => true
  validates :discipline_id, :presence => true
  validates :city,          :city => true
end