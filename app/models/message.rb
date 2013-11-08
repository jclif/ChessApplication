class Message < ActiveRecord::Base
  attr_accessible :body, :sender_id, :recipient_id

  validates :body, presence: true, :allow_blank => false
end
