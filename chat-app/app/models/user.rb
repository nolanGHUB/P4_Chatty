class User < ApplicationRecord
  # encrypt password
  has_secure_password
  after_update_commit {AppearanceBroadcastJob.perform_later self}

  # Model associations
  has_many :chat_messages, foreign_key: :created_by
  has_many :friends, foreign_key: :user_adding_friend_id
  # Validations
  #validates_presence_of :name, :email, :password_digest
  validates :name, presence: true
  validates :email, uniqueness: true, presence: true
  validates :password_digest, presence: true



  #def appear
  #  self.update(is_online: true)
  #  ActionCable.server.broadcast "chat_channel", {event: 'appear', id: self.id, name: self.name}
  #end
  #
  #def disappear
  #  self.update(is_online: false)
  #  ActionCable.server.broadcast "chat_channel", {event: 'disappear', id: self.id, name: self.name}
  #end

  def appear
    self.update(is_online: true)
  end

  def disappear
    self.update(is_online: false)
  end


end