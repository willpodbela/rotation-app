Rails.application.routes.draw do

  root to: "landing#index"
  post "sign_up", to: "landing#sign_up"
  get "status", to: "landing#status"
  devise_for :users
  resources :items do
    resources :reservations
  end
  
  namespace :api, defaults: {format: :json} do
    post "auth/login"
    get "auth/logout"
    post "auth/forgot"
    post "users", to: "users#create"
    resources :items
    get "reservations/info"
    resources :reservations
  end
end
