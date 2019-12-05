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
  json.current_subscription     !@user.current_subscription.nil?
  if @user.current_subscription
    json.reservations_remaining @user.reservations_remaining
  else
    #NOTE: Logic for backward compatibility with new model specs as reservations_remaining can't be nil
    json.reservations_remaining 2
  end
end