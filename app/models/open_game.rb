class OpenGame < ActiveRecord::Base
  attr_accessible :user_id, :user_color

  belongs_to :user

  validates_inclusion_of :user_color, :in => %w(white black random),
    :message => "%{value} is not a valid choice"
end
