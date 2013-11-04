class FriendshipsController < ApplicationController

  def create
    @friendship = Friendship.new(to_user_id: params[:to_user_id])
    @friendship.from_user_id = current_user.id

    if @friendship.save!
      @from_user = User.find_by_id(current_user.id)
      @to_user = User.find_by_id(params[:to_user_id])
      from_user_json = @from_user.as_json(methods: [:accepted_friend_ids, :pending_friends_received_ids, :pending_friends_sent_ids, :past_games])

      to_user_json = @to_user.as_json(methods: [:accepted_friend_ids, :pending_friends_received_ids, :pending_friends_sent_ids, :past_games])
      puts to_user_json
      puts from_user_json
      Pusher.trigger("user_#{@from_user.id}_channel", "update_profile", from_user_json)
      Pusher.trigger("user_#{@to_user.id}_channel", "update_profile", to_user_json)
      render nothing: true
    else
      render json: @friendship.errors, status: 422
    end
  end

  def destroy

  end

end
