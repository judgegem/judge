class CreateFakeCollections < ActiveRecord::Migration
  def self.up
    create_table :fake_collections do |t|
      t.string :value
      t.string :text

      t.timestamps
    end
  end

  def self.down
    drop_table :fake_collections
  end
end
