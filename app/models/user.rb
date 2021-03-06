module Authentication
  module ActiveRecordHelpers

    def self.included(base)
      base.extend ClassMethods
    end

    module ClassMethods
      def find_for_oauth(auth)
        record = where(provider: auth.provider, uid: auth.uid.to_s).first
        record || create(provider: auth.provider, uid: auth.uid, email: auth.info.email, password: Devise.friendly_token[0,20])
      end
    end
  end
end

class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me, :provider, :uid

  include Authentication::ActiveRecordHelpers

  has_many :friendships_created, class_name: "Friendship", foreign_key: :from_user_id, primary_key: :id
  has_many :friendships_proposed_to, class_name: "Friendship", foreign_key: :to_user_id, primary_key: :id

  def as_json(options = {})
    super({only: [:id, :elo, :email, :last_request_at]}.merge(options))
  end

  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    if user
      return user
    else
      registered_user = User.where(:email => auth.info.email).first
      if registered_user
        return registered_user
      else
        user = User.create(provider:auth.provider,
                           uid:auth.uid,
                           email:auth.info.email,
                           password:Devise.friendly_token[0,20],
                           # name:auth.extra.raw_info.name
                          )
      end
    end
  end

  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    user = User.where(:provider => access_token.provider, :uid => access_token.uid ).first
    if user
      return user
    else
      registered_user = User.where(:email => access_token.info.email).first
      if registered_user
        return registered_user
      else
        user = User.create(name: data["name"],
          provider:access_token.provider,
          email: data["email"],
          uid: access_token.uid ,
          password: Devise.friendly_token[0,20],
        )
      end
    end
  end

  def accepted_friends
    potential_friendships = self.friendships_created + self.friendships_proposed_to

    potential_friendships.keep_if { |friendship| friendship.accepted == true }

    potential_friendships.map do |friendship|
      if friendship.from_user_id == self.id
        user = User.find_by_id(friendship.to_user_id)
      else
        user = User.find_by_id(friendship.from_user_id)
      end
      {email: user.email, id: user.id, email: user.email, last_sign_in_at: user.last_sign_in_at, elo: user.elo}
    end
  end

  def pending_friends_received
    users = User.find_by_sql([<<-SQL, true, self.id])
      SELECT DISTINCT
        users.*
      FROM
        users
      JOIN
        friendships as f
      ON
        users.id = f.from_user_id
      WHERE
        f.pending = ?
      AND
        f.to_user_id = ?
    SQL

    users.map do |user|
      {email: user.email, id: user.id, email: user.email, last_sign_in_at: user.last_sign_in_at, elo: user.elo}
    end
  end

  def pending_friends_sent_ids
    users = User.find_by_sql([<<-SQL, true, self.id])
      SELECT DISTINCT
        users.id
      FROM
        users
      JOIN
        friendships as f
      ON
        users.id = f.to_user_id
      WHERE
        f.pending = ?
      AND
        f.from_user_id = ?
    SQL

    users.map do |user|
      user.id
    end
  end

  def accepted_games
    Game.find_by_sql([<<-SQL, true, self.id, self.id])
      SELECT
        games.*
      FROM
        games
      WHERE
        accepted = ?
      AND
        (white_user_id = ? OR black_user_id = ?)
    SQL
  end

  def past_games
    Pgn.where(["white_user_id = ?", self.id]) + Pgn.where(["black_user_id = ?", self.id])
  end

  def pending_games_received
    Game.where(["white_user_id = ? AND pending = ?", self.id, true]) + Game.where(["black_user_id = ? AND pending = ?", self.id, true])
  end

  def messages_exchanged_with(user_id)
    Message.where(["(recipient_id = ? AND sender_id = ?) OR (recipient_id = ? AND sender_id = ?)", self.id, user_id, user_id, self.id])
  end

end
