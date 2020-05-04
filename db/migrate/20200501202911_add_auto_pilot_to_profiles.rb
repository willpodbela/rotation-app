class AddAutoPilotToProfiles < ActiveRecord::Migration[5.1]
  def change
    add_column :profiles, :auto_pilot, :boolean, default: false
  end
end
