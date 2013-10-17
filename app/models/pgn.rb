class Pgn < ActiveRecord::Base
  attr_accessible :white_user_id, :black_user_id, :moves, :results, :game_id

  belongs_to :white_user, class_name: "User", foreign_key: :white_user_id, primary_key: :id
  belongs_to :black_user, class_name: "User", foreign_key: :black_user_id, primary_key: :id

end
