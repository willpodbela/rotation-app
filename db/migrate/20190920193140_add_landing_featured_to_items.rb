class AddLandingFeaturedToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :landing_featured, :boolean, :null => false, :default => false
  end
end
