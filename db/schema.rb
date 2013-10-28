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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131017135307) do

  create_table "friendships", :force => true do |t|
    t.integer  "from_user_id",                    :null => false
    t.integer  "to_user_id",                      :null => false
    t.boolean  "accepted",     :default => false, :null => false
    t.boolean  "pending",      :default => true,  :null => false
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
  end

  add_index "friendships", ["from_user_id"], :name => "index_friendships_on_from_user_id"
  add_index "friendships", ["to_user_id"], :name => "index_friendships_on_to_user_id"

  create_table "games", :force => true do |t|
    t.string   "moves",          :default => ""
    t.integer  "white_user_id",                           :null => false
    t.integer  "black_user_id",                           :null => false
    t.string   "current_player", :default => "white"
    t.string   "current_board"
    t.string   "message",        :default => "Good luck", :null => false
    t.boolean  "check",          :default => false,       :null => false
    t.boolean  "checkmate",      :default => false,       :null => false
    t.boolean  "draw",           :default => false,       :null => false
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
  end

  add_index "games", ["black_user_id"], :name => "index_games_on_black_user_id"
  add_index "games", ["white_user_id"], :name => "index_games_on_white_user_id"

  create_table "pgns", :force => true do |t|
    t.integer  "white_user_id",  :null => false
    t.integer  "black_user_id",  :null => false
    t.string   "moves",          :null => false
    t.integer  "results",        :null => false
    t.integer  "white_elo_diff", :null => false
    t.integer  "black_elo_diff", :null => false
    t.integer  "game_id",        :null => false
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "pgns", ["black_user_id"], :name => "index_pgns_on_black_user_id"
  add_index "pgns", ["white_user_id"], :name => "index_pgns_on_white_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "",   :null => false
    t.string   "encrypted_password",     :default => "",   :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "elo",                    :default => 1200, :null => false
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at",                               :null => false
    t.datetime "updated_at",                               :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
