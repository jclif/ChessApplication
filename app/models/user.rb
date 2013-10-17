class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me

  def pending_friend_reqests_recieved
    Friendship.where(["to_user_id = ? AND pending = ?", self.id, true])
  end

  def denied_friend_requests_recieved
    Friendship.where(["to_user_id = ? AND accepted = ?", self.id, false])
  end

  def friends
    User.find_by_sql([<<-SQL, true, true, self.id, self.id, self.id, self.id, self.id])
      SELECT DISTINCT
        users.*
      FROM
        users
      JOIN
        friendships as ff
      ON
        users.id = ff.from_user_id
      JOIN
        friendships as ft
      ON
        users.id = ft.to_user_id
      WHERE
        (ff.accepted = ? OR ft.accepted = ?)
      AND
        (ff.from_user_id = ? OR ff.to_user_id = ? OR ft.from_user_id = ? OR ft.to_user_id = ?)
      AND
        users.id != ?
    SQL
  end

  def games
    Game.where(["white_user_id = ?", self.id]) + Game.where(["black_user_id = ?", self.id])
  end

  def past_games
    Pgn.where(["white_user_id = ?", self.id]) + Pgn.where(["black_user_id = ?", self.id])
  end

end
