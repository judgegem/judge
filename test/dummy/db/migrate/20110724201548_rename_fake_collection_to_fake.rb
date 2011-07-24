class RenameFakeCollectionToFake < ActiveRecord::Migration
  def self.up
    rename_table :fake_collections, :fakes
  end

  def self.down
    rename_table :fakes, :fake_collections
  end
end
