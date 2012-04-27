FactoryGirl.define do
  factory :user do
    dob { Time.new(2011,11,5, 17,00,00) }
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