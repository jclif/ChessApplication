# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.delete_all
Game.delete_all
Pgn.delete_all

users = User.create([
  {email: "test1@gmail.com", password: "password"},
  {email: "test2@gmail.com", password: "password"}
]),

games = Game.create([
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id},
  {white_user_id: User.first.id, black_user_id: User.last.id}
])

Game.all.each do |game|
  game.try_move("f2f3")
  game.try_move("e7e5")
  game.try_move("g2g4")
end
