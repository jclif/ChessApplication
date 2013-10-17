class Friendship < ActiveRecord::Base
  attr_accessible :from_user_id, :to_user_id

  belongs_to :from_user, class_name: "User", foreign_key: :from_user_id, primary_key: :id
  belongs_to :to_user, class_name: "User", foreign_key: :to_user_id, primary_key: :id

  validates_uniqueness_of :from_user_id, scope: [:to_user_id]
  validate :no_reverse_pair

  private
  def no_reverse_pair
    errors.add(:friendship, "That friendship request is pending.") if Friendship.find_by_from_user_id_and_to_user_id(self.to_user_id, self.from_user_id)
  end
end
