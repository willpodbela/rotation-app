class AddWebAuthenticationTokenToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :web_authentication_token, :string
  end
end
