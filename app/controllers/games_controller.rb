class GamesController < ApplicationController
  respond_to :json

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def index
  end

  def create
    @game = Game.new(params[:game])
    @game.white_user_id = current_user.id

    if @game.save!
      head :ok
    else
      render nothing: true, status: :unprocessable_entity
    end
  end

  def update
    @game = Game.find(params[:id])
    move = params[:moves].split(" ")[-1]
    current_player_id = @game.current_player == "white" ? @game.white_user_id : @game.black_user_id

    if current_user.id == current_player_id
      if @game.try_move(move)
        p 'pusher-ing'
        Pusher.trigger('my-channel', 'my-event', {message: 'Hello World'})
      end
    else
      render nothing: true, status: :not_modified
    end
  end

end
