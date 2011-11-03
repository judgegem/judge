# setup fake ActiveRecord class for tests
ActiveRecord::Base.establish_connection(:adapter => "sqlite3", :database => ":memory:")
ActiveRecord::Schema.define(:version => 1) do
  create_table :users do |t|
    t.string :name
    t.string :username
    t.string :country
    t.integer :age
  end
end
class User < ActiveRecord::Base
  validates :name,     :presence     => true
  validates :username, :length       => { :maximum => 10 }
  validates :country,  :format       => { :with => /[A-Za-z]/, :allow_blank => true }
  validates :age,      :numericality => { :only_integer => true, :greater_than => 13 }
end

# hack to stop #url_for error
module ActionDispatch::Routing::PolymorphicRoutes
  def polymorphic_path(record_or_hash_or_array, options = {})
    ""
  end
end