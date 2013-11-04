ChessApplication::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "omniauth_callbacks" }

  root to: "games#index"

  resources :games, only: [:show, :index, :create, :update]
  resources :open_games, only: [:create, :update]
  resources :users, only: [:show, :index]
  resources :friendships, only: [:create] do
    collection do
      post :respond
    end
  end
end
