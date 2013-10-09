class GamesController < ApplicationController
  before_filter :authenticate_user!
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
    p move
    p @game.try_move(move)

    head :ok
  end

end
