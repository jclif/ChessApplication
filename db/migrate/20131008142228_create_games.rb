class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :moves, default: ""
      t.integer :white_user_id, null: false
      t.integer :black_user_id, null: false
      t.string :current_player, default: "white"


      t.timestamps
    end

    add_index :games, :white_user_id
    add_index :games, :black_user_id
  end
end