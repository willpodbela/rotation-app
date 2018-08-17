Rails.application.routes.draw do
  
  root to: "landing#index"
  post "sign_up", to: "landing#sign_up"
  get "status", to: "landing#status"
  get "admin", to: "landing#admin"
  get "download", to: "landing#download"
  get "privacy", to: "landing#privacy"
  
  resources "users", only: :index do
    resource :profile, only: [:show, :edit, :update]
    get "release", on: :member
  end
  devise_for :users
  
  resources :items do
    resources :reservations
  end
  
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"
      
      get 'config', to: 'config#index'
    
      resources :users, only: [:create, :show] do
        resource :profile, only: [:show, :update]
      end
    
      resources :items
    
      resources :reservations do
        get 'info', on: :collection
      end
    
      post 'devices/:token', to: 'devices#create'
      delete 'devices/:token', to: 'devices#destroy'
    end
  end
end
