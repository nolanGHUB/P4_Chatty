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

  attr_accessor :user

  def subscribed
    stream_from 'chat_channel'
  end

  def appear(data)
    @user = User.find(data["id"])
    @user.appear
  end

  def disappear(data)
    puts "FROM DISAPPEAR"
  end

  def unsubscribed
    puts "FROM UNSUBSCRIBED"
    @user.disappear
  end

  def create(opts)
    ChatMessage.create(
        content: opts.fetch('content'), created_by: opts.fetch('created_by'), destination: opts.fetch('destination')
    )
  end
end