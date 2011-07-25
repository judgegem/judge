class CreateContinentCountryAndCityTables < ActiveRecord::Migration
  def self.up
    create_table :continents do |t|
      t.integer :id
      t.string :name
    end
    create_table :countries do |t|
      t.integer :id
      t.integer :continent_id
      t.string :name
    end
    create_table :cities do |t|
      t.integer :id
      t.integer :country_id
      t.string :name
    end
  end

  def self.down
    drop_table :continents
    drop_table :countries
    drop_table :cities
  end
end
