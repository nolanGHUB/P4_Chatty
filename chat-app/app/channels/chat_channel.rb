#class ChatChannel < ApplicationCable::Channel
#  def subscribed
#    # stream_from "some_channel"
#  end
#
#  def unsubscribed
#    # Any cleanup needed when channel is unsubscribed
#  end
#end
class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'chat_channel'
  end

  def unsubscribed; end

  def create(opts)
    ChatMessage.create(
        content: opts.fetch('content')
    )
  end
end