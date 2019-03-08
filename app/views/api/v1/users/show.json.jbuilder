json.user do
  json.id                   @user.id
  json.auth_token           @user.authentication_token
  json.email                @user.email
  json.is_waitlist          @user.waitlist?
  json.is_email_confirmed   @user.confirmed?
  json.profile do
    json.merge!             @user.profile.attributes
  end
  if @user.coupon
    json.coupon             @user.coupon
  end
end