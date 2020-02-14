class FriendsController < ApplicationController
  before_action :set_friend, only: [:destroy]

  # GET /friends
  def index
    @friends = current_user.friends
    json_response(@friends)
  end

  # POST /friends
  def create
    @friend = current_user.friends.create!(friend_params)
    json_response(@friend, :created)
  end

  # DELETE /friends/:id
  def destroy
    @friend.destroy
    json_response(status: 'SUCCESS', message: 'deleted the friend', data: @friend.friend_name)
  end

  private

  def friend_params
    # whitelist params
    params.permit(:user_adding_friend_id, :friend_id, :friend_name)
  end

  def set_friend
    @friend = Friend.find(params[:id])
  end
end
