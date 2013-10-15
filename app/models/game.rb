class Game < ActiveRecord::Base
  attr_accessible :white_user_id, :black_user_id

  validates :white_user_id, :black_user_id, presence: true
  after_create  :default_board

  belongs_to :white_player, class_name: "User", foreign_key: :white_user_id
  belongs_to :black_player, class_name: "User", foreign_key: :black_user_id

  def make_pgn

  end

  def default_board
    game = ChessGame.new

    self.current_board = game.json_board
    self.save!
  end

  def try_move(move) # long algebraic notation: 'e2e4'
    response = ChessGame.eval_move({moves: self.moves, poss_move: move})

    if response[:valid]
      self.switch_turn
      self.checkmate = response[:checkmate]
      self.check = response[:check]
      self.draw = response[:draw]
      self.moves = [self.moves, move].join(" ")
      self.current_board = response[:board]
      self.message = response[:message]
      self.save!
      return true
    else
      return false
    end
  end

  def switch_turn
    if self.current_player == "white"
      self.current_player = "black"
    elsif
      self.current_player = "white"
    end

    self.save
  end

  def active_player_id
    i = (self.turn_num % 2) + 1

    if i == 1
      return self.white_user_id
    else
      return self.black_user_id
    end
  end

  def turn_num
    (self.moves.split(" ").length / 2) + 1
  end

end

module MoveParser
  def alg_to_coords(input) # ["f2", "f3"] => [[6,5],[5,5]]
    coords = input.map do |pos|
      col = ("a".."h").to_a.index(pos[0])
      [8-pos[1].to_i, col]
    end

    coords
  end

  def long_alg_to_coord(long_alg) # "f2f3 " => [[6,5],[5,5]]
    alg = [long_alg[0..1], long_alg[2..3]] # ["f2", "f3"]
    alg_to_coords(alg)                     #
  end
end

class ChessGame
  include MoveParser
  attr_accessor :board, :turn, :players, :move_hashes, :moving

  def self.eval_move(params)
    response = Hash.new
    moves = params[:moves] # 'e2e4 ...'
    game = ChessGame.new
    poss_move = game.long_alg_to_coord(params[:poss_move]) # 'e2e4'
    moves_array = moves.split(" ") # ['e2e4', ...]

    moves_array.map! do |el|
      game.long_alg_to_coord(el)
    end # [[[6,4], [4,4]], ...]

    moves_array.each do |move|
      game.board.make_move(move)
      game.move_hashes << {piece: game.board[move[1]], move: move}
      game.switch_turn
    end

    response[:valid] = game.board.valid?(poss_move)
    if response[:valid]
      game.board.make_move(poss_move)
      game.move_hashes << {piece:game.board[poss_move[1]], move: poss_move}
      game.switch_turn
    end
    response[:board] = game.json_board

    if game.board.won?
      response[:message] = "#{game.turn} won!"
      response[:checkmate] = true
      response[:check] = true
      response[:draw] = false
    elsif game.board.check? && !game.board.won?
      response[:message] = "#{game.turn.to_s.capitalize} in check."
      response[:checkmate] = false
      response[:check] = true
      response[:draw] = false
    elsif game.board.draw?
      response[:message] = "It's a draw!"
      response[:checkmate] = false
      response[:check] = false
      response[:draw] = true
    else
      response[:message] = ""
      response[:checkmate] = false
      response[:check] = false
      response[:draw] = false
    end

    response
  end

  def initialize
    @board = Board.new(self)
    @turn = :white
    @players = {white: HumanPlayer.new(:white, self), black: HumanPlayer.new(:black, self)}
    @move_hashes = []
    @moving = false # dirty hack for making sure when you check a move to see
    # if the resulting position from a pawn promotion move doesnt' leave you in check,
    # you don't prompt user for what piece they want to upgrade (because if won't matter)
  end

  def json_board
    yamlized_board = self.board.board.to_yaml

    unicode_board = YAML::load(yamlized_board)

    unicode_board.each do |row|
      row.map! do |piece|
        if piece.nil?
          ""
        else
          piece.unicode
        end
      end
    end

    unicode_board.to_json
  end

  def switch_turn
    self.turn = turn == :white ? :black : :white
  end
end

class Board
  attr_accessor :board, :game

  def initialize(game)
    @game = game
    @board = new_board
  end

  def [](*args)
    if args.length == 2
      board[args[0]][args[1]]
    elsif args.length == 1
      board[args[0][0]][args[0][1]]
    else
      raise StandardError.new "Square brackets needs 1 or 2 arguments."
    end
  rescue StandardError => e
    puts e.message
    puts args
  end

  def []=(*args)
    value = args.pop
    if args.length == 2
      board[args[0]][args[1]] = value
    elsif args.length == 1
      board[args[0][0]][args[0][1]] = value
    else
      raise StandardError.new "Square brackets needs 1 or 2 arguments."
    end
  rescue StandardError => e
    puts e.message
    puts args
  end

  def new_board
    Array.new(8) do |row|
      if row == 0 || row == 7
        Array.new(8) do |col|
          if col == 0 || col == 7
            Rook.new([row, col], game)
          elsif col == 1 || col == 6
            Knight.new([row, col], game)
          elsif col == 2 || col == 5
            Bishop.new([row, col], game)
          elsif col == 4
            King.new([row, col], game)
          else
            Queen.new([row, col], game)
          end
        end
      elsif row == 1 || row == 6
        Array.new(8) { |col| Pawn.new([row, col], game) }
      else
        Array.new(8)
      end
    end
  end

  def make_move(move) # [[6,0],[5,0]]
    if self[move[0]].is_a?(King)
      black_queenside = [[0, 4], [0, 2]]
      black_kingside = [[0, 4], [0, 6]]
      white_queenside = [[7, 4], [7, 2]]
      white_kingside = [[7, 4], [7, 6]]

      case move
      when black_queenside
        make_move([[0, 0],[0, 3]])
      when black_kingside
        make_move([[0, 7],[0, 5]])
      when white_queenside
        make_move([[7, 0],[7, 3]])
      when white_kingside
        make_move([[7, 7],[7, 5]])
      end
    end

    self[move[1]] = self[move[0]]

    if en_passant_move?(move)
      self[game.move_hashes.last[:move][1]] = nil
    else
      self[move[0]] = nil
    end

    self[move[1]].pos = move[1]

    piece = self[move[1]]

    if game.moving
      if piece.is_a?(Pawn)
        if piece.color == :white && piece.pos[0] == 0
          promote_pawn(piece)
        elsif piece.color == :black && piece.pos[0] == 7
          promote_pawn(piece)
        end
      end
    end
  end

  def promote_pawn(piece)
    # get a piece choice from user
    # create choosen piece on current pieces pos
    input = ""
    regexp = Regexp.new('[BNRQ]')
    until regexp.match(input)
      puts "Which piece would you like your pawn to become? ('B', 'N', 'R', 'Q')"
      input = gets.chomp
    end

    color = piece.color

    case input
    when 'B'
      new_piece = Bishop.new(piece.pos, game)
      self[piece.pos] = new_piece
      new_piece.color = color
    when 'N'
      new_piece = Knight.new(piece.pos, game)
      self[piece.pos] = new_piece
      new_piece.color = color
    when 'R'
      new_piece = Rook.new(piece.pos, game)
      self[piece.pos] = new_piece
      new_piece.color = color
    when 'Q'
      new_piece = Queen.new(piece.pos, game)
      self[piece.pos] = new_piece
      new_piece.color = color
    end
  end

  def en_passant_move?(move)
    return false unless !game.move_hashes.empty? && # it isnt' the first move
      game.move_hashes.last[:piece].is_a?(Pawn) &&  # the last move was a pawn move
      2 == (game.move_hashes.last[:move][0][0] - game.move_hashes.last[:move][1][0]).abs && # that pawn move was a two space move
      (move[1][1] == game.move_hashes.last[:move][1][1]) && # the current moves end position column shares the last moves end position column
      1 == (move[0][1] - game.move_hashes.last[:move][1][1]).abs # the current moves start position column is one space away from the last moves end position column

    true
  end

  def render
    puts "    a  b  c  d  e  f  g  h "
    game.board.board.each_with_index do |row, i|
      print " #{8 - i} "
      row.each_with_index do |piece, j|
        color = (i + j).even? ? :light_cyan : :cyan
        if piece
          print " #{piece} ".colorize(:background => color)
        else
          print "   ".colorize( :background => color )
        end
      end
      print "\n"
    end

    puts "You're in check." if check?
  end

  def valid?(move) # [[5, 5], [6, 5]]
    # finish refactoring
    from_pos, to_pos = move

    from_piece = self[from_pos]

    #check for empty from_space
    return false if from_piece.nil?

    return false unless from_piece.color == game.turn

    #en_passant
    if en_passant_move?(move) && from_piece.get_attack_coords.include?(to_pos) && !yields_check?(move)
      return true
    end

    if self[to_pos] #theres a piece at to spot
      to_piece = self[to_pos]
      return false if to_piece.color == from_piece.color
      return false unless from_piece.get_attack_coords.include?(to_pos)
    else #there's no piece at to_pos
      return false unless from_piece.get_peaceful_coords.include?(to_pos)
    end

    return !yields_check?(move)
  end

  def yields_check?(move)
    yamlized_game = game.to_yaml

    g = YAML::load(yamlized_game)

    g.board.make_move(move)

    return g.board.check?
  end

  def check?
    game.board.board.each do |row|
      row.each_with_index do |piece, i|
        next if piece.nil? || piece.color == game.turn
        attack_coords = piece.get_attack_coords
        attack_coords.each do |coord|
          if game.board[coord].is_a?(King) && game.board[coord].color == game.turn
            return true
          end
        end
      end
    end

    false
  end

  def won?
    return false unless draw?
    return check?
  end

  def draw?
    board.each do |row|
      row.each do |piece|
        next if piece.nil? || piece.color != game.turn

        unless piece.get_peaceful_coords.empty? && piece.get_attack_coords.empty?
          coords = (piece.get_peaceful_coords + piece.get_attack_coords).keep_if { |c| valid?([piece.pos, c]) }

          return false unless coords.empty?
        end
      end
    end

    true
  end
end

class Piece

  attr_accessor :pos, :color, :unicode, :game

  def initialize(pos, game)
    @pos = pos
    @color = get_color
    @unicode = ""
    @game = game
  end

  def to_s
    unicode
  end

  def get_color
    return [6, 7].include?(pos[0]) ? :white : :black
  end

  def on_board?(to_pos)
    to_pos[0].between?(0, 7) && to_pos[1].between?(0, 7)
  end

end

class Pawn < Piece
  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2659" : "\u265F"
  end

  def get_peaceful_coords
    coords = []
    if color == :white
      coords << [pos[0] - 1, pos[1]]
      coords << [pos[0] - 2, pos[1]] if pos[0] == 6 && game.board[(pos[0] - 1), pos[1]].nil?
    else
      coords << [pos[0] + 1, pos[1]]
      coords << [pos[0] + 2, pos[1]] if pos[0] == 1 && game.board[(pos[0] + 1), pos[1]].nil?
    end

    coords.keep_if { |p| on_board?(p) }
  end

  def get_attack_coords
    coords = []
    if color == :white
      coords << [pos[0] - 1, pos[1] - 1]
      coords << [pos[0] - 1, pos[1] + 1]
    else
      coords << [pos[0] + 1, pos[1] - 1]
      coords << [pos[0] + 1, pos[1] + 1]
    end

    if color == :white
      if en_passant?(:right)
        coords << [pos[0] - 1, pos[1] + 1]
      end

      if en_passant?(:left)
        coords << [pos[0] - 1, pos[1] - 1]
      end
    else
      if en_passant?(:right)
        coords << [pos[0] + 1, pos[1] + 1]
      end

      if en_passant?(:left)
        coords << [pos[0] + 1, pos[1] - 1]
      end
    end

    coords.keep_if { |p| on_board?(p) }
  end

  def en_passant?(direction)
    # skip first turn
    return false if game.move_hashes.length < 3

    if color == :white?
      return false unless pos[0] == 3
    else
      return false unless pos[0] == 4
    end
    return false unless game.move_hashes.last[:piece].is_a?(Pawn)

    enemy_start_pos = game.move_hashes.last[:move][0]
    enemy_end_pos = game.move_hashes.last[:move][1]

    if color == :white?
      unless (enemy_start_pos[0] == pos[0] - 1) && (enemy_end_pos[0] == pos[0])
        return false
      end
    else
      unless (enemy_start_pos[0] == pos[0] + 1) && (enemy_end_pos[0] == pos[0])
        return false
      end
    end

    if direction == :right
      unless (enemy_start_pos[1] == pos[1] + 1) && (enemy_end_pos[1] == pos[1] + 1)
        return false
      end
    else
      unless (enemy_start_pos[1] == pos[1] - 1) && (enemy_end_pos[1] == pos[1] - 1)
        return false
      end
    end

    true
  end
end

class Knight < Piece
  MOVE_DIFF = [[1,2],[2,1],[-1,2],[2,-1],[1,-2],[-2,1],[-1,-2],[-2,-1]]
  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2658" : "\u265E"
  end

  def get_peaceful_coords
    coords = []

    MOVE_DIFF.each do |diff|
      coords << [pos,diff].transpose.map { |x| x.reduce(:+) }
    end

    coords.keep_if { |p| on_board?(p) }
  end

  def get_attack_coords
    #because they are identical
    get_peaceful_coords
  end
end

class MultiMover < Piece
  def initialize(pos, game)
    super(pos,game)
  end

  def get_peaceful_coords
    coords = []

    self.class::MOVE_DIFF.each do |diff|
      i = 1
      until i == self.class::MOVE_LENGTH

        multiplied = [diff[0] * i, diff[1] * i]
        trans = [pos,multiplied].transpose.map { |x| x.reduce(:+) }

        break if !(on_board?(trans)) || game.board[trans[0], trans[1]]

        coords << trans

        i += 1
      end
    end

    coords.keep_if { |coord| on_board?(coord) }
  end

  def get_attack_coords

    coords = []
    add_to_coords = nil

    self.class::MOVE_DIFF.each do |diff|
      i = 1
      until i == self.class::MOVE_LENGTH

        multiplied = [diff[0] * i, diff[1] * i]
        trans = [pos,multiplied].transpose.map { |x| x.reduce(:+) } # [2, 2]

        add_to_coords = trans
        break if !(on_board?(trans)) || game.board[trans[0], trans[1]]

        i += 1
      end

      coords << add_to_coords
    end

    coords.keep_if { |p| on_board?(p) && p != pos }
  end
end

class Bishop < MultiMover
  MOVE_DIFF = [[-1, -1], [1, 1], [1, -1], [-1, 1]]
  MOVE_LENGTH = 8

  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2657" : "\u265D"
  end
end

class Rook < MultiMover
  MOVE_DIFF = [[1,0], [-1, 0], [0, 1], [0, -1]]
  MOVE_LENGTH = 8

  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2656" : "\u265C"
  end
end

class Queen < MultiMover
  MOVE_DIFF = [[1,0], [-1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [1, -1], [-1, 1]]
  MOVE_LENGTH = 8

  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2655" : "\u265B"
  end
end

class King < MultiMover
  MOVE_DIFF = [[1,0], [-1, 0], [0, 1], [0, -1], [-1, -1], [1, 1], [1, -1], [-1, 1]]
  MOVE_LENGTH = 2

  def initialize(pos, game)
    super(pos, game)
    @unicode = @color == :white ? "\u2654" : "\u265A"
  end

  def get_peaceful_coords
    coords = super

    co = castle_options # :kingside, #queenside #both #neither

    case co
    when :kingside
      y = turn == :white ? 7 : 0
      coords << [y, 6]
    when :queenside
      y = turn == :white ? 7 : 0
      coords << [y, 2]
    when :both
      y = turn == :white ? 7 : 0
      coords << [y, 6]
      coords << [y, 2]
    end

    coords
  end

  def castle_options
    #not in check currently
    return :neither if game.board.check?

    king = game.board.board.flatten.select { |piece| piece && piece.is_a?(King) && piece.color == game.turn}[0]

    #king hasnt moved
    return :neither if game.move_hashes.any? { |hash| hash.has_value?(king) }

    q_rook = game.board.board.flatten.select { |piece| piece && piece.is_a?(Rook) && piece.color == game.turn && piece.pos[1] == 0}[0]

    can_castle_queenside = can_castle?(q_rook, king)

    k_rook = game.board.board.flatten.select { |piece| piece && piece.is_a?(Rook) &&
      piece.color == game.turn && piece.pos[1] == 7}[0]

    can_castle_kingside = can_castle?(k_rook, king)

    if can_castle_kingside && can_castle_queenside
      return :both
    elsif can_castle_kingside
      return :kingside
    elsif can_castle_queenside
      return :queenside
    else
      return :neither
    end
  end

  def can_castle?(rook, king)
    return false if game.move_hashes.any? { |hash| hash.has_value?(rook) }

    if rook.pos[1] == 0 #if it's queenside
      path = [[rook.pos[0], 1], [rook.pos[0], 2], [rook.pos[0], 3]]
    else #if it's kingside
      path = [[rook.pos[0], 5], [rook.pos[0], 6]]
    end

    #check for pieces in path
    return false if path.any? { |coord| game.board[coord] }

    board.board.each do |row|
      row.each do |piece|
        next if piece.nil? || piece.color == game.turn

        return false unless (piece.get_attack_coords & path).empty?

      end
    end

    true
  end
end

class HumanPlayer

  attr_accessor :color, :game

  def initialize(color, game)
    @color = color
    @game = game
  end

  def get_move
    regexp = Regexp.new('[a-h][0-8] [a-h][0-8]')
    move = ""

    loop do
      puts "Enter your move, or q to quit! Ex: 'f2 f3'"
      input = gets.chomp

      abort("Thanks for playing!") if input == "q"
      next unless regexp.match(input)

      move = game.pgn_to_coords(input)
      break if game.board.valid?(move)
    end

    move
  end
end
