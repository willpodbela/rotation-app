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
  
  #DEPRECATED as of iOS <= v1.1.10, we now pass the whole subscription object with the subscription key
  json.current_subscription     !@user.current_subscription.nil?
  #END DEPRECATED
end