class CreateUsers < ActiveRecord::Migration[5.2]
  def change
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
      t.string :city
      t.string :telephone
    end
  end
end
