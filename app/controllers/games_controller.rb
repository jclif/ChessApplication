class GamesController < ApplicationController
  before_filter :authenticate_user!

  def show
    @game = Game.find(params[:id])
  end

  def index
  end

end
