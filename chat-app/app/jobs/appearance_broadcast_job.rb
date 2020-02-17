#app/jobs/appearance_broadcast_job.rb
class AppearanceBroadcastJob < ApplicationJob
  queue_as :default

  def perform(user)
    #ActionCable.server.broadcast "appearance_#{user.is_online}", render_json(user)
    #ActionCable.server.broadcast "chat_channel", {event: 'appear', id: self.id, name: self.name}
    #ActionCable.server.broadcast "chat_channel", json_response(user)

    if user.is_online == true
      stance = 'appear'
    elsif user.is_online == false
      stance = 'disappear'
    end
    ActionCable.server.broadcast "chat_channel", {event: stance, id: user.id, name: user.name}
  end

  private

  def render_json(user)
    #ApplicationController.renderer.render(json: user)
    clean_user = {"id" => user.id, "name" => user.name, "email" => user.email, "is_online" => user.is_online}
    json_response(user)
  end

end