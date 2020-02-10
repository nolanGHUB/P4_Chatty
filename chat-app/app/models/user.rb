class User < ApplicationRecord
  # encrypt password
  has_secure_password

  # Model associations
  has_many :chat_messages, foreign_key: :created_by
  # Validations
  #validates_presence_of :name, :email, :password_digest
  validates :name, presence: true
  validates :email, uniqueness: true, presence: true
  validates :password_digest, presence: true

  #after_update_commit {AppearanceBroadcastJob.perform_later self}
  def appear
    self.update(is_online: true)
    ActionCable.server.broadcast "chat_channel", {event: 'appear', user_id: self.id, name: self.name}
  end

  def disappear
    self.update(is_online: false)
    ActionCable.server.broadcast "chat_channel", {event: 'disappear', user_id: self.id, name: self.name}
  end

end