class CreateFriends < ActiveRecord::Migration[6.0]
  def change
    create_table :friends do |t|
      t.string :user_adding_friend_id
      t.string :friend_id
      t.string :friend_name

      t.timestamps
    end
  end
end
