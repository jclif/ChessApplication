class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_last_request_at

  def set_last_request_at
     current_user.update_attribute(:last_request_at, Time.now.utc) if user_signed_in?
  end
end
