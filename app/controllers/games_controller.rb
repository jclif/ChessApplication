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

    if @game.try_move(move)
      head :ok
    else
      render status: :not_modified
    end

  end

end
