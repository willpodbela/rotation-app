json.user do
  json.id                       @user.id
  json.auth_token               @user.authentication_token
  json.email                    @user.email
  json.is_waitlist              @user.waitlist?
  json.is_email_confirmed       @user.confirmed?
  json.profile do
    json.merge!                 @user.profile.attributes
  end
  if @user.coupon
    json.coupon                 @user.coupon
  end
  json.est_delivery_date        @user.est_delivery_date
  json.subscription             @user.current_subscription
  if @user.current_subscription
    json.reservations_remaining @user.reservations_remaining
  end
  
  #FIXME these trigger API calls to Stripe in model
  json.available_tiers          @user.available_tiers
  json.account_balance          @user.account_balance
  #END FIXME
end