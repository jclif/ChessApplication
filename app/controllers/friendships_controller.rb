class FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(params[:friendship])
    friendship.from_user_id = current_user.id

    if friendship.save!
      head :ok
    else
      render json: @game.errors, status: 422
    end
  end

  def destroy

  end

end
