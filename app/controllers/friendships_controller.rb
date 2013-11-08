class FriendshipsController < ApplicationController

  def create
    @friendship = Friendship.new(to_user_id: params[:to_user_id])
    @friendship.from_user_id = current_user.id

    if @friendship.save!
      @from_user = User.find_by_id(current_user.id)
      @to_user = User.find_by_id(params[:to_user_id])
      from_user_json = @from_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])
      to_user_json = @to_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])
      Pusher.trigger("user_#{@from_user.id}_channel", "update_profile", from_user_json)
      Pusher.trigger("user_#{@to_user.id}_channel", "update_profile", to_user_json)
      render nothing: true
    else
      render json: @friendship.errors, status: 422
    end
  end

  def respond
    if params[:response] == "accept"
      f = Friendship.find_by_user_ids(current_user.id, params[:user_id])
      f.accepted = true
      f.pending = false
      if f.save!
        @from_user = User.find_by_id(f.from_user_id)
        @to_user = User.find_by_id(f.to_user_id)
        from_user_json = @from_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])

        to_user_json = @to_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])
        Pusher.trigger("user_#{@from_user.id}_channel", "update_profile", from_user_json)
        Pusher.trigger("user_#{@to_user.id}_channel", "update_profile", to_user_json)
        render nothing: true
      else
        render json: f.errors, status: 422
      end
    elsif params[:response] == "destroy" || params[:response] == "deny"
      @f = Friendship.find_by_user_ids(current_user.id, params[:user_id])
      f = @f
      if @f.delete
        @from_user = User.find_by_id(f.from_user_id)
        @to_user = User.find_by_id(f.to_user_id)
        from_user_json = @from_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])

        to_user_json = @to_user.as_json(methods: [:accepted_friends, :pending_friends_received, :pending_friends_sent_ids, :past_games])
        Pusher.trigger("user_#{@from_user.id}_channel", "update_profile", from_user_json)
        Pusher.trigger("user_#{@to_user.id}_channel", "update_profile", to_user_json)
        render nothing: true
      else
        render json: @f.errors, status: 422
      end
    else
      render status: 422
    end
  end

end
