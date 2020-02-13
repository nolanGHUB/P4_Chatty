class ChatMessagesController < ApplicationController
  skip_before_action :authorize_request, only: :create

  def index
    @messages = User.joins(:chat_messages).select("chat_messages.id", "users.name", "chat_messages.content", "chat_messages.created_at").order("chat_messages.id").last(10)
    json_response(@messages)
  end
end
