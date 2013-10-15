class CreatePgns < ActiveRecord::Migration
  def change
    create_table :pgns do |t|
      t.integer :white_user_id, null: false
      t.integer :black_user_id, null: false
      t.string :moves, null: false
      t.integer :results, null: false
      t.integer :white_elo_diff
      t.integer :black_elo_diff

      t.timestamps
    end

    add_index :pgns, :white_user_id, :black_user_id
  end
end
