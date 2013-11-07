class OpenGamesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def index
    @open_games = OpenGame.find(:all, include: :user)
    render json: @open_games.to_json(include: {user: {only: [:email, :elo]}})
  end

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

  def destroy
    p params
    @open_game = OpenGame.find_by_id(params[:id])
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
        @game.pending = false
        @game.accepted = true
      elsif user_color == "black"
        @game.white_user_id = current_user.id
        @game.black_user_id = @open_game.user_id
        @game.pending = false
        @game.accepted = "true"
      end
      other_player_id = current_user.id == @game.white_user_id ? @game.black_user_id : @game.white_user_id

      if @game.save!
        open_game = @open_game
        @open_game.delete
        Pusher.trigger("user_#{other_player_id}_channel", "add_game", @game.to_json)
        Pusher.trigger("open_games_channel", "delete_game", open_game.to_json)
        render json: @game, status: 200
      else
        render json: @game.errors, status: 422
      end
    end
  end
end
