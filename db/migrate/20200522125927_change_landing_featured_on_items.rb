class ChangeLandingFeaturedOnItems < ActiveRecord::Migration[5.1]
  def up
    change_column :items, :landing_featured, :string, :null => true
  end
  
  def down
    change_column :items, :landing_featured, "boolean USING landing_featured::boolean", :null => false
  end
end
