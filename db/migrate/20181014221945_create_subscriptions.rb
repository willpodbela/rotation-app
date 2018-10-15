class CreateSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :subscriptions do |t|
      t.string :stripe_subscription_id, :null => false
      t.string :stripe_plan_id, :null => false
      t.integer :status, :null => false
      t.integer :user_id, :null => false
       
      t.timestamps
    end
  end
end
