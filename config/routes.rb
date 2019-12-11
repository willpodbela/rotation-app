Rails.application.routes.draw do
  root to: "application#react_index_html"

  get "admin", to: "landing#admin"
  get "download", to: "landing#download"

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

  resources :referral_codes do
    resource :coupon, only: [:new, :create, :show]
  end
  resources :advertisement_codes do
    resource :coupon, only: [:new, :create, :show]
  end

  namespace :api, defaults: {format: :json} do
    post "stripe", to: "stripe_webhook#stripe"

    #DEPRECATED as of iOS < v1.2 as we are now calling api/v2
    namespace :v1 do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"

      get 'config', to: 'config#index'

      resources :users, only: [:create, :show, :update] do
        resource :profile, only: [:show, :update]
        post "sign_up", on: :collection
      end

      resources :items, only: [:index, :show] do
        resource :favorite, only: [:create, :destroy]
        get "list", on: :collection
      end

      resources :reservations do
        get 'info', on: :collection
        post 'buy', on: :member
      end

      post "subscriptions", to: "subscriptions#create"
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
        post 'buy', on: :member
      end

      resource :subscription, only: [:create, :show, :update] do
        post "update-payment", on: :collection
      end

      post 'devices/:token', to: 'devices#create'
      delete 'devices/:token', to: 'devices#destroy'
    end

    namespace :web do
      post "auth/login"
      get "auth/logout"
      post "auth/forgot"

      resources :users, only: [:create, :show, :update] do
        resource :profile, only: [:show, :update]
        post 'lead', on: :collection
        get 'me', on: :collection
      end

      resources :items, only: [:index, :show] do
        resource :favorite, only: [:create, :destroy]
      end

      resources :reservations do
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

  # Fallback any routes that do not match above to React
  get '*path', to: "application#react_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
  get '*path', to: "application#react_non_html"
end
