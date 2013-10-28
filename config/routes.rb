ChessApplication::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }

  root to: "games#index"

  resources :games, only: [:show, :index, :create, :update]
  resources :users, only: [:show]
end
