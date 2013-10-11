# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Game.delete_all

users = User.create([
  {email: "test1@gmail.com", password: "password"},
  {email: "test2@gmail.com", password: "password"}
])

games = Game.create([
  {white_user_id: 1, black_user_id: 2}
])
