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
    #:current_user.appear
  end

  def appear(data)
    #:current_user.appear
    #print "HEY OH HEY OH HEY OH HEY OH HEY OH~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    #print data
    #puts data["userId"]
    tempUser = User.find(data["userId"])
    tempUser.appear
    #ActionCable.server.broadcast "chat_channel", {event: 'appear', user_id: data.userId}
  end

  def disappear(data)
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    puts "FROM DISAPPEAR!!!"
    tempUser = User.find(data["userId"])
    tempUser.disappear
  end

  def unsubscribed
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    puts "FROM UNSUBSCRIBED"
    #:current_user.disappear
  end

  def create(opts)
    ChatMessage.create(
        content: opts.fetch('content'), created_by: opts.fetch('created_by')
    )
  end
end