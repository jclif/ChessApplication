class Friendship < ActiveRecord::Base
  attr_accessible :from_user_id, :to_user_id

  belongs_to :from_user, class_name: "User", foreign_key: :from_user_id, primary_key: :id
  belongs_to :to_user, class_name: "User", foreign_key: :to_user_id, primary_key: :id

  validate :no_duplicates, on: :create

  def self.find_by_user_ids(id1, id2)
    f1 = Friendship.find_by_from_user_id_and_to_user_id(id1, id2)
    f2 = Friendship.find_by_from_user_id_and_to_user_id(id2, id1)

    if f1
      return f1
    elsif f2
      return f2
    else
      return nil
    end
  end

  private

  def no_duplicates
    if Friendship.find_by_from_user_id_and_to_user_id(self.to_user_id, self.from_user_id) ||
       Friendship.find_by_from_user_id_and_to_user_id(self.from_user_id, self.to_user_id)
      errors.add(:friendship, "That friendship request is pending.")
    end
  end

end
