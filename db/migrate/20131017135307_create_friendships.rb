class CreateFriendships < ActiveRecord::Migration
  def change
    create_table :friendships do |t|
      t.integer :from_user_id, null: false
      t.integer :to_user_id, null: false
      t.boolean :accepted, default: false, null: false
      t.boolean :pending, default: true, null: false

      t.timestamps
    end

    add_index :friendships, :from_user_id
    add_index :friendships, :to_user_id
  end
end
