class AuthenticationController < ApplicationController
  # return auth token once user is authenticated
  skip_before_action :authorize_request, only: :authenticate

  def authenticate
    user =
        AuthenticateUser.new(auth_params[:email], auth_params[:password]).call
    json_response(auth_token: user[0], name: user[1], email: auth_params[:email], id: user[2])
  end

  private

  def auth_params
    params.permit(:email, :password)
  end
end