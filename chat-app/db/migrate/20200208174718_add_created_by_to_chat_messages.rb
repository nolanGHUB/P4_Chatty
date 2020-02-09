class AddCreatedByToChatMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_messages, :created_by, :string
  end
end
