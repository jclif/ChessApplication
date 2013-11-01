class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    render json: @user.as_json(methods: [:past_games, :friends, :pending_friend_requests_recieved, :denied_friend_requests_recieved, :accepted_friends])
  end

  def index
    @users = User.find(:all, conditions: ['email LIKE ?', "%#{params[:term]}%"])
    @users_array = @users.map do |user|
      {value: user.email, label: user.email}
    end
    render json: @users_array
  end

end
