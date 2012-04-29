FactoryGirl.define do
  factory :user do
    dob { Time.new(2011,11,5, 17,00,00) }
    sequence(:name) { |n| "User #{n}" }
    age 40
    bio "I'm a user"
    sequence(:password) { |n| "password_#{n}" }
    gender { ["male", "female", "other", "withheld"].sample }
    city "London"
    time_zone "London"
    discipline
    team
  end

  factory :team do
    sequence(:name) {|n| "Team #{n}" }
  end

  factory :category do
    sequence(:name) {|n| "Category #{n}" }
  end

  factory :sport do
    sequence(:name) {|n| "Sport #{n}" }
    category
  end

  factory :discipline do
    sequence(:name) {|n| "Discipline #{n}" }
    sport
  end
end