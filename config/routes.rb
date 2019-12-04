Rails.application.routes.draw do
  root to: "landing#index"
  post "sign_up", to: "landing#sign_up"
  get "status", to: "landing#status"
  get "update-payment", to: "landing#update_payment"
  get "admin", to: "landing#admin"
  get "download", to: "landing#download"
  get "privacy", to: "landing#privacy"
  get "terms", to: "landing#terms"
  
  resource :prelauncher, only: [:create, :show]
  resources :jobs, only: [:index, :show]
  
  resources "users", only: :index do
    resource :profile, only: [:show, :edit, :update]
    get "release", on: :member
    get "become", on: :member
  end
  devise_for :users
  
  resources :reservations, only: [:index]
  resources :fulfillment, only: [:index]
  resources :units, only: [:index]
  resources :items do
    resources :reservations, shallow: true
    resources :units, shallow: true
    get 'image-matching-tool', on: :collection
  end
  
  resources :subscriptions, only: [:create] do
    get "cancel", on: :collection
    get "restore", on: :collection
    post "update-payment", on: :collection
  end
  
  resources :referral_codes do
    resource :coupon, only: [:new, :create, :show]
  end
  resources :advertisement_codes do
    resource :coupon, only: [:new, :create, :show]
  end
  
  namespace :api, defaults: {format: :json} do
    post "stripe", to: "stripe_webhook#stripe"
  
    #DEPRECATED as of iOS <= v1.1.11 we are on v2
    namespace :v1 do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"
      
      get 'config', to: 'config#index'
    
      resources :users, only: [:create, :show, :update] do
        resource :profile, only: [:show, :update]
      end
    
      resources :items, only: [:index, :show] do
        resource :favorite, only: [:create, :destroy]
      end
    
      resources :reservations do
        get 'info', on: :collection
        post 'buy', on: :member
      end
      
      #DEPRECATED as of iOS <= v1.1.10, we are using the singular resource path for subscriptions, so we just route the old path to the controller for now and have both
      post "subscriptions", to: "subscriptions#create" 
      #END DEPRECATED     
      resource :subscription, only: [:create, :show, :update] do
        post "update-payment", on: :collection
      end
      
      post 'devices/:token', to: 'devices#create'
      delete 'devices/:token', to: 'devices#destroy'
    end
    #END DEPRECATED
    
    namespace :v2 do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"
      
      resources :users, only: [:create, :show, :update] do
        resource :profile, only: [:show, :update]
      end
    
      resources :items, only: [:index, :show] do
        resource :favorite, only: [:create, :destroy]
      end
    
      resources :reservations do
        get 'info', on: :collection
        post 'buy', on: :member
      end
         
      resource :subscription, only: [:create, :show, :update] do
        post "update-payment", on: :collection
      end
      
      post 'devices/:token', to: 'devices#create'
      delete 'devices/:token', to: 'devices#destroy'
    end
    
    namespace :warehouse do
      namespace :v1 do
        resources :units, only: [:show, :update] do
          post "returned", on: :member
        end
      end
    end
  end
end
