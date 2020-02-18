class AddCreatedByNameToChatMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_messages, :created_by_name, :string
  end
end
