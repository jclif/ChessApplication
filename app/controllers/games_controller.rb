class GamesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  def index
    @open_games = OpenGame.all
  end

  def create
    p params
    if params[:current_user_color_choice].downcase == "white"
      white_user_id = current_user.id
      black_user_id = params[:opponent_id]
    elsif params[:current_user_color_choice].downcase == "black"
      white_user_id = params[:opponent_id]
      black_user_id = current_user.id
    end
    @game = Game.new(white_user_id: white_user_id, black_user_id: black_user_id)
    other_player_id = current_user.id == @game.white_user_id ? @game.black_user_id : @game.white_user_id

    if @game.save!
      Pusher.trigger("user_#{other_player_id}_channel", "add_game", @game.to_json)
      render json: @game, status: 200
    else
      render json: @game.errors, status: 422
    end
  end

  def update
    @game = Game.find(params[:id])
    move = params[:moves].split(" ")[-1]
    current_player_id = @game.current_player == "white" ? @game.white_user_id : @game.black_user_id

    if current_user.id == current_player_id && @game.try_move(move)
      if @game.checkmate
        @pgn = @game.make_pgn
        w = @game.white_player
        b = @game.black_player
        w.elo += @pgn.white_elo_diff
        b.elo += @pgn.black_elo_diff
        w.save!
        b.save!

        game = @game
        @game.delete
        # Pusher: update and delete for detail view
        if @pgn.save!
          Pusher.trigger("game_#{game.id}_channel", "delete_game", @pgn.to_json)
          Pusher.trigger("game_#{game.id}_channel", "render_pgn", {pgn: @pgn, game: game})
          render nothing: true
        else
          render json: @pgn.errors, status: 422
        end
      else
        Pusher.trigger("game_#{@game.id}_channel", "update_game", @game.to_json)
        render nothing: true
      end
    else
      render json: @game.errors, status: 422
    end
  end
end
