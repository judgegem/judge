class Foo < ActiveRecord::Base

  validates :one,    :presence => true
  validates :two,    :length => { :in => 5..10, :allow_blank => true }
  validates :three,  :exclusion => { :in => %w{foo bar} }
  validates :four,   :numericality => { :only_integer => true, :odd => true, :less_than_or_equal_to => 7 },
                     :exclusion => { :in => [3,12] }
  validates :five,   :format => { :without => /[A-Za-z]+/ }
  validates :six,    :acceptance => true
  validates :seven,  :confirmation => true
  validates :eight,  :confirmation => true

  validates :nine,   :presence => true, :uniqueness => true
  validates :ten,    :presence => true
  validates :eleven, :presence => true
  validates :twelve, :presence => true

end

