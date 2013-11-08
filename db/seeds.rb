# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.delete_all
Game.delete_all
OpenGame.delete_all
Pgn.delete_all

# For testing game/user stuff

test_users = User.create([
  {email: "test1@gmail.com", password: "password"},
  {email: "test2@gmail.com", password: "password"},
])

test_games = Game.create([
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
  {white_user_id: test_users[0].id, black_user_id: test_users[1].id, accepted: true, pending: false},
])

test_games.each do |game|
  game.try_move("f2f3")
  game.try_move("e7e5")
  game.try_move("g2g4")
end

test_open_games = OpenGame.create([
  {user_id: test_users[0].id, user_color: "white"},
  {user_id: test_users[0].id, user_color: "black"},
  {user_id: test_users[0].id, user_color: "random"},
])

test_friendships = Friendship.create([
  {from_user_id: test_users[0].id, to_user_id: test_users[1].id},
])

f = test_friendships[0]
f.accepted = true
f.pending = false
f.save!

# For guest account
