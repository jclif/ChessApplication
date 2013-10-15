class CreatePgns < ActiveRecord::Migration
  def change
    create_table :pgns do |t|
      t.integer :white_user_id, null: false
      t.integer :black_user_id, null: false
      t.string :moves, null: false
      t.integer :results, null: false

      t.timestamps
    end

    add_index :pgns, :user_id, :opponent_id
  end
end
