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
    get "become", on: :member
  end
  devise_for :users
  
  resources :reservations, only: [:index]
  resources :units, only: [:index]
  resources :items do
    resources :reservations, shallow: true
    resources :units, shallow: true
    get 'image-matching-tool', on: :collection
  end
  
  resources :subscriptions, only: [:create] do
    get "cancel", on: :collection
    get "restore", on: :collection
  end
  
  resources :referral_codes do
    resource :coupon, only: [:new, :create, :show]
  end
  resources :advertisement_codes do
    resource :coupon, only: [:new, :create, :show]
  end
  
  namespace :api, defaults: {format: :json} do
    post "stripe", to: "stripe_webhook#stripe"
  
    namespace :v1 do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"
      
      get 'config', to: 'config#index'
    
      resources :users, only: [:create, :show, :update] do
        resource :profile, only: [:show, :update]
      end
    
      resources :items
    
      resources :reservations do
        get 'info', on: :collection
        post 'buy', on: :member
      end
      
      resources :subscriptions, only: [:create] do
        get "cancel", on: :collection
        get "restore", on: :collection
      end
      
      post 'devices/:token', to: 'devices#create'
      delete 'devices/:token', to: 'devices#destroy'
    end
  end
end
