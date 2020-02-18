class RemoveCreatedByNameFromChatMessages < ActiveRecord::Migration[6.0]
  def change
    remove_column :chat_messages, :created_by_name
  end
end
