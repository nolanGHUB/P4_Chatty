class UsersController < ApplicationController

  # POST /signup
  # return authenticated token upon signup
  skip_before_action :authorize_request, only: :create

  def index
    @users = User.select("id", "name", "email", "is_online")
    json_response(@users)
  end

  def create
    user = User.create!(user_params)
    auth_token = AuthenticateUser.new(user.email, user.password).call
    response = { message: Message.account_created, auth_token: auth_token[0], name: auth_token[1], id: auth_token[2] }
    json_response(response, :created)
  end

  # GET /user/:id
  def show
    user = User.find(params[:id])
    clean_user = {"id" => user.id, "name" => user.name, "email" => user.email, "is_online" => user.is_online}
    json_response(clean_user)
  end

  #def is_online
  #  self.update_attributes(is_online: true)
  #end
  #
  #def is_offline
  #  self.update_attributes(is_online: false)
  #end

  private

  def user_params
    params.permit(
        :name,
        :email,
        :password,
        :password_confirmation
    )
  end
end