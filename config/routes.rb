ChessApplication::Application.routes.draw do
  devise_for :users, :controllers => { :registrations => "registrations" }

  devise_scope :user do
      root to: "devise/sessions#new"
  end

  resources :games, only: [:show, :index, :create, :update]
end
