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
  json.reservations_remaining   @user.reservations_remaining
  json.est_delivery_date        @user.est_delivery_date
  json.subscription             @user.current_subscription
  
  #FIXME this triggers an API call to Stripe in model
  json.available_tiers          @user.available_tiers
  #END FIXME
end