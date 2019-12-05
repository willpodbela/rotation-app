class AddCreditsAppliedToPrelaunchUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :prelaunch_users, :credits_applied, :integer, :null => false, :default => 0
  end
end
