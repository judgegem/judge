class CreateFoos < ActiveRecord::Migration
  def self.up
    create_table :foos do |t|
      t.string :one
      t.string :two
      t.string :three
      t.string :four
      t.string :five
      t.string :six
      t.string :seven
      t.string :eight
      t.string :nine
      t.string :ten
      t.string :eleven
      t.string :twelve
      t.string :thirteen
      t.string :fourteen
 
      t.timestamps
    end
  end

  def self.down
    drop_table :foos
  end
end
