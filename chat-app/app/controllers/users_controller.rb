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

  # GET /users/:id
  def show
    user = User.find(params[:id])
    clean_user = {"id" => user.id, "name" => user.name, "email" => user.email, "is_online" => user.is_online}
    json_response(clean_user)
  end

  # PUT /users/:id
  def update
    user = User.find(params[:id])
    user.update(user_params)
    json_response(status: 'SUCCESS', message: 'updated username', data: user.name)
  end

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