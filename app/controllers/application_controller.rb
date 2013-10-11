class ApplicationController < ActionController::Base

  def after_sign_in_path_for(resource)
      games_url
  end

  protect_from_forgery
end
