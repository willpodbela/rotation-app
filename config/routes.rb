Rails.application.routes.draw do
  get 'reservations/index'

  get 'reservations/show'

  get 'reservations/new'

  get 'reservations/edit'

  root to: "landing#index"
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
  end
end
