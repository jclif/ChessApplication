class MessagesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    puts params
    user_id = params[:user_id]
    @messages = current_user.messages_exchanged_with(user_id).limit(10).order('created_at asc')
    render json: @messages
  end

  def create
    puts params
    recipient_id = params[:user_id]
    sender_id = current_user.id
    @message = Message.new(sender_id: sender_id, recipient_id: recipient_id, body: params[:body])

    if @message.save!
      Pusher.trigger("user_#{recipient_id}_channel", "update_convo_with_#{sender_id}", @message.to_json)

      render json: @message, status: 200
    else
      render json: @message.errors, status: 422
    end
  end

end
