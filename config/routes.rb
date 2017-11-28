Rails.application.routes.draw do
  root to: "landing#index"
  devise_for :users
  resources :items
  
  namespace :api, defaults: {format: :json} do
    post "auth/login"
    get "auth/logout"
    post "auth/forgot"
    post "users", to: "users#create"
    resources :items
  end
end
