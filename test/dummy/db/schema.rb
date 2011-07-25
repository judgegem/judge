# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110725082530) do

  create_table "cities", :force => true do |t|
    t.integer "country_id"
    t.string  "name"
  end

  create_table "continents", :force => true do |t|
    t.string "name"
  end

  create_table "countries", :force => true do |t|
    t.integer "continent_id"
    t.string  "name"
  end

  create_table "fakes", :force => true do |t|
    t.string   "value"
    t.string   "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "foos", :force => true do |t|
    t.string   "one"
    t.string   "two"
    t.string   "three"
    t.string   "four"
    t.string   "five"
    t.string   "six"
    t.string   "seven"
    t.string   "eight"
    t.string   "nine"
    t.string   "ten"
    t.string   "eleven"
    t.string   "twelve"
    t.string   "thirteen"
    t.string   "fourteen"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
