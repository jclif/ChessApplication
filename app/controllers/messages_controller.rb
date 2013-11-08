class MessagesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    puts params
    user_id = params[:user_id]
    @messages = current_user.messages_exchanged_with(user_id).limit(10).order('created_at asc')
    render json: @messages
  end

end
