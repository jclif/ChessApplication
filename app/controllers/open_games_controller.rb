class OpenGamesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def create
    @open_game = OpenGame.new(params[:open_game])
    @open_game.user_id = current_user.id

    if @open_game.save!
      puts "create success!"
      Pusher.trigger("open_games_channel", "add_game", @open_game.to_json)
    else
      puts "create fail!"
      render json: @open_game.errors, status: 422
    end
  end

  def update
    # check to make sure current user isn't joining his own game
    @open_game = OpenGame.find_by_id(params[:open_game][:id])
    if current_user == @open_game.user_id
      render status: 400
    else
      if @open_game.user_color == "random"
        user_color = ["white", "black"].sample
      else
        user_color = @open_game.user_color
      end

      @game = Game.new
      if user_color == "white"
        @game.white_user_id = @open_game.user_id
        @game.black_user_id = current_user.id
      elsif user_color == "black"
        @game.white_user_id = current_user.id
        @game.black_user_id = @open_game.user_id
      end
      other_player_id = current_user.id == @game.white_user_id ? @game.black_user_id : @game.white_user_id

      if @game.save!
        puts "create success!"
        Pusher.trigger("user_#{other_player_id}_channel", "add_game", @game.to_json)
        render json: @game, status: 200
      else
        puts "create fail!"
        render json: @game.errors, status: 422
      end
    end
  end
end
