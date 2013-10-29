class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    render json: @user.as_json(methods: [:past_games, :friends, :pending_friend_requests_recieved, :denied_friend_requests_recieved])
  end

  def index
    @users = User.find(:all, conditions: ['email LIKE ?', "%#{params[:term]}%"])
    render json: @users.as_json(only: [:id, :email])
  end

end
