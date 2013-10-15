class UsersController < ApplicationController
  respond_to :json

  def show
    @user = User.find(params[:id])
    p @user.inspect
    render json: @user.as_json(:methods => :games)
  end

end
