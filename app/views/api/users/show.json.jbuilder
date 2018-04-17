json.user do
  json.auth_token           @user.authentication_token
  json.email                @user.email
  json.is_waitlist          @user.waitlist?
end