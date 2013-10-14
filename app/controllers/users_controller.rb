class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    p @user.inspect
    render json: @user
  end

end
