json.user do
  json.auth_token           @user.authentication_token
  json.email                @user.email
end