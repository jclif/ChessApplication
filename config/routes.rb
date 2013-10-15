ChessApplication::Application.routes.draw do
  devise_for :users

  root to: "games#index"

  resources :games, only: [:show, :index, :create, :update, :destroy]
  resources :users, only: [:show]
end
