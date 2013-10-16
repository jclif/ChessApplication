class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  # attr_accessible :title, :body

  def games
    Game.where("white_user_id = ?", self.id) + Game.where("black_user_id = ?", self.id)
  end

  def past_games
    Pgn.where("white_user_id = ?", self.id) + Pgn.where("black_user_id = ?", self.id)
  end

end
