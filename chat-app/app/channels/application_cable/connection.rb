module ApplicationCable
  class Connection < ActionCable::Connection::Base
    #identified_by :current_user
    #
    #def connect
    #  self.current_user = User.find_by(id: cookies.signed[:user_id])
    #end
    #
    #protected
    #
    #def find_verified_user
    #  if (verified_user = User.find_by(id: cookies.signed[:user_id]))
    #    verified_user
    #  end
    #end
  end
end
