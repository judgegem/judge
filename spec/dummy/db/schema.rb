# encoding: UTF-8
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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20120426221506) do

  create_table "categories", force: :cascade do |t|
    t.string "name"
  end

  create_table "disciplines", force: :cascade do |t|
    t.string  "name"
    t.integer "sport_id"
  end

  create_table "sports", force: :cascade do |t|
    t.string  "name"
    t.integer "category_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
  end

  create_table "users", force: :cascade do |t|
    t.string  "name"
    t.string  "username"
    t.string  "country"
    t.integer "age"
    t.text    "bio"
    t.string  "password"
    t.boolean "accepted"
    t.text    "gender"
    t.date    "dob"
    t.integer "team_id"
    t.string  "time_zone"
    t.integer "discipline_id"
    t.string  "city"
    t.string  "telephone"
  end

end
