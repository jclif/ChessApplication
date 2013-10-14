ChessApplication::Application.routes.draw do
  devise_for :users

  root to: "games#index"

  resources :games, only: [:show, :index, :create, :update]
  resources :users, only: [:show]
end
