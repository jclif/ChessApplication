class FriendshipsController < ApplicationController

  def create
    @friendship = Friendship.new(params[:friendship])
    @friendship.from_user_id = current_user.id

    if @friendship.save!
      @from_user = User.find_by_id(from_user_id)
      @to_user = User.find_by_id(to_user_id)
      from_json = @from_user.as_json(methods: [:past_games, :friends, :pending_friend_requests_recieved, :denied_friend_requests_recieved, :accepted_friends])
      to_json = @to_user.as_json(methods: [:past_games, :friends, :pending_friend_requests_recieved, :denied_friend_requests_recieved, :accepted_friends])
      Pusher.trigger("user_#{from_user_id}_channel", "update_profile", from_json)
      Pusher.trigger("user_#{to_user_id}_channel", "update_profile", to_json)
    else
      render json: @friendship.errors, status: 422
    end
  end

  def destroy

  end

end
