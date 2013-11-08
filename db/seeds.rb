User.delete_all
Game.delete_all
OpenGame.delete_all
Pgn.delete_all

# For testing game/user stuff

test_users = User.create([
  {email: "test1@gmail.com", password: "password"},
  {email: "test2@gmail.com", password: "password"},
  {email: "guest@example.com", password: "guestpassword"},
])

test_games = Game.create([
  {white_user_id: test_users[2].id, black_user_id: test_users[0].id, accepted: true, pending: false},
  {white_user_id: test_users[2].id, black_user_id: test_users[0].id, accepted: true, pending: false},
  {white_user_id: test_users[2].id, black_user_id: test_users[0].id, accepted: true, pending: false},
  {white_user_id: test_users[1].id, black_user_id: test_users[2].id, accepted: true, pending: false},
  {white_user_id: test_users[1].id, black_user_id: test_users[2].id, accepted: true, pending: false},
  {white_user_id: test_users[1].id, black_user_id: test_users[2].id, accepted: true, pending: false},
])

test_games.each_with_index do |game, index|
  if index > 2
    game.try_move("f2f3")
    game.try_move("e7e5")
    game.try_move("g2g4")
  end
end

test_open_games = OpenGame.create([
  {user_id: test_users[0].id, user_color: "white"},
  {user_id: test_users[1].id, user_color: "black"},
  {user_id: test_users[2].id, user_color: "random"},
])

test_friendships = Friendship.create([
  {from_user_id: test_users[1].id, to_user_id: test_users[2].id},
  {from_user_id: test_users[0].id, to_user_id: test_users[2].id}
])

test_messages = Message.create([
  {sender_id: test_users[0].id, recipient_id: test_users[1].id, body: "Yo"},
  {sender_id: test_users[1].id, recipient_id: test_users[0].id, body: "Sup"},
  {sender_id: test_users[0].id, recipient_id: test_users[1].id, body: "How's it goin"},
  {sender_id: test_users[1].id, recipient_id: test_users[0].id, body: "Muy bien"},
  {sender_id: test_users[0].id, recipient_id: test_users[1].id, body: "Chess?"},
  {sender_id: test_users[1].id, recipient_id: test_users[0].id, body: "Chess."},
])

f = test_friendships[0]
f.accepted = true
f.pending = false
f.save!
