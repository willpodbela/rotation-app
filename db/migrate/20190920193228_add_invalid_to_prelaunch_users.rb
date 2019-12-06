class AddInvalidToPrelaunchUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :prelaunch_users, :bounced, :boolean, :null => false, :default => false
  end
end
