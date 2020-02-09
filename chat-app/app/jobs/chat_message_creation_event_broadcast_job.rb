# app/jobs/chat_message_creation_event_broadcast_job.rb
class ChatMessageCreationEventBroadcastJob < ApplicationJob
  queue_as :default

  def perform(chat_message)
    name = User.find(chat_message.created_by)
    ActionCable
        .server
        .broadcast('chat_channel',
                   id: chat_message.id,
                   created_at: chat_message.created_at.strftime('%H:%M'),
                   content: chat_message.content,
                   name: name.name)
  end
end