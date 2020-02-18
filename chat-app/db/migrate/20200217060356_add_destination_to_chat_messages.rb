class AddDestinationToChatMessages < ActiveRecord::Migration[6.0]
  def change
    add_column :chat_messages, :destination, :string
  end
end
