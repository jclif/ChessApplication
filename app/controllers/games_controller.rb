class GamesController < ApplicationController
  respond_to :json

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def index
  end

  def update
    @game = Game.find(params[:id])
    move = params[:moves].split(" ")[-1]

    current_player_id = @game.current_player == "white" ? @game.white_user_id : @game.black_user_id
    try_move = @game.try_move(move)

    if current_user.id == current_player_id && try_move
      head :ok
    else
      render nothing: true, status: :not_modified
    end

  end

end
