class Message < ActiveRecord::Base
  attr_accessible :body, :sender_id, :recipient_id
end
