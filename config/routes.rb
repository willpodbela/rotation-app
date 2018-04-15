Rails.application.routes.draw do
  
  root to: "landing#index"
  post "sign_up", to: "landing#sign_up"
  get "status", to: "landing#status"
  get "admin", to: "landing#admin"
  
  resources "users", only: :index do
    get "release", on: :member
  end
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
