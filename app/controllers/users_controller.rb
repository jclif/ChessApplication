class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    render json: @user.as_json(:methods => :past_games)
  end

end
