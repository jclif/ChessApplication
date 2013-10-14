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
    other_player_id = current_user.id == @game.white_user_id ? @game.black_user_id : @game.white_user_id

    if @game.save!
      puts "create success!"
      Pusher.trigger("user_#{other_player_id}_channel", "add_game", @game.to_json)
      render json: @game
    else
      puts "create fail!"
      render json: @game.errors, status: 422
    end
  end

  def update
    @game = Game.find(params[:id])
    move = params[:moves].split(" ")[-1]
    current_player_id = @game.current_player == "white" ? @game.white_user_id : @game.black_user_id
    other_player_id = current_user.id == @game.white_user_id ? @game.black_user_id : @game.white_user_id

    if current_user.id == current_player_id && @game.try_move(move)
      Pusher.trigger("user_#{other_player_id}_channel", "update_games", @game.to_json)
      Pusher.trigger("game_#{@game.id}_channel", "update_game", @game.to_json)
      render json: @game
    else
      render json: @game.errors, status: 422
    end
  end

end
