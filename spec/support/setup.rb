# setup fake ActiveRecord class for tests
ActiveRecord::Base.establish_connection(:adapter => "sqlite3", :database => ":memory:")
ActiveRecord::Schema.define(:version => 1) do
  create_table :users do |t|
    t.string :name
    t.string :username
    t.string :country
    t.integer :age
    t.text :bio
    t.string :password
    t.boolean :accepted
    t.text :gender
    t.date :dob
    t.integer :team_id
    t.string :time_zone
    t.integer :discipline_id
    t.string :foo
  end
  create_table :teams do |t|
    t.string :name
  end
  create_table :categories do |t|
    t.string :name
  end
  create_table :sports do |t|
    t.string :name
    t.integer :category_id
  end
  create_table :disciplines do |t|
    t.string :name
    t.integer :sport_id
  end
end

class User < ActiveRecord::Base
  belongs_to :team

  validates :name,          :presence => true
  validates :username,      :length => { :maximum => 10 }
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
  validates :foo,           :foo => true
end

class Team < ActiveRecord::Base; end

class Category < ActiveRecord::Base
  has_many :sports
end
class Sport < ActiveRecord::Base
  belongs_to :category
  has_many :disciplines
end
class Discipline < ActiveRecord::Base
  belongs_to :sport
  belongs_to :user
end

# hack to stop #url_for error
module ActionDispatch::Routing::PolymorphicRoutes
  def polymorphic_path(record_or_hash_or_array, options = {})
    ""
  end
end