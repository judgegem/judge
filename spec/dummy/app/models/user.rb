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
  validates :name,          :length => { :maximum => 10 }, :if => Proc.new { false }
  validates :bio,           :uniqueness => true
  validates :country,       :uniqueness => { :case_sensitive => false }
  validates :dob,           :uniqueness => true, :unless => Proc.new { true }
  validates :team_id,       :numericality => { :only_integer => true, :judge => :ignore }
  validates :discipline_id, :uniqueness => { :judge => :force }, :if => Proc.new { false }
  validates :time_zone,     :presence => { :judge => :ignore }
  validates :gender,        :presence => { :judge => :unknown_option }
  validates :telephone,     :numericality => { :only_integer => true }
end
