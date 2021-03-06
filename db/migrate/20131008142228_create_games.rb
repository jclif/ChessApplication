class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.text :moves, default: ""
      t.integer :white_user_id, null: false
      t.integer :black_user_id, null: false
      t.string :current_player, default: "white"
      t.text :current_board
      t.boolean :check, default: false, null: false
      t.boolean :checkmate, default: false, null: false
      t.boolean :draw, default: false, null: false
      t.boolean :accepted, default: false, null: false
      t.boolean :pending, default: true, null: false

      t.timestamps
    end

    add_index :games, :white_user_id
    add_index :games, :black_user_id
  end
end
