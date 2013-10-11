class RegistrationsController < Devise::RegistrationsController
  def new
    flash[:errors] = 'Registrations are not open at this time, but please check back soon !!!'
    redirect_to root_url
  end

  def create
    flash[:errors] = 'Registrations are not open at this time, but please check back soon !!!'
    redirect_to root_url
  end
end
