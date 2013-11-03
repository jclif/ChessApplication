class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    render json: @user.as_json(methods: [:past_games, :pending_friends_sent, :pending_friends_received, :accepted_friends])
  end

  def index
    puts params
    if params[:term]
      @users = User.find(:all, conditions: ['email LIKE ?', "%#{params[:term]}%"])
      @users_array = @users.map do |user|
        {label: user.email}
      end
      render json: @users_array
    elsif params[:user_email]
      @user = User.find_by_email(params[:user_email])
      puts "putsing"
      puts @user
      @user_id = {userId: @user.id}
      render json: @user_id
    end
  end

end
