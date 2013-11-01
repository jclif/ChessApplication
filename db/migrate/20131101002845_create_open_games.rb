class CreateOpenGames < ActiveRecord::Migration
  def change
    create_table :open_games do |t|
      t.integer :user_id, null: false
      t.string :user_color, null: false

      t.timestamps
    end

    add_index :open_games, :user_id
  end
end
