class CreateSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :subscriptions do |t|
      t.string :stripe_subscription_id, :null => false
      t.string :stripe_plan_id, :null => false
      t.integer :status, :null => false
      t.integer :billing_status
      t.integer :user_id, :null => false
      t.datetime :start, :null => false
      t.datetime :current_period_start, :null => false
      t.datetime :current_period_end, :null => false
      
      t.timestamps
    end
    add_index :subscriptions, :stripe_subscription_id, unique: true
  end
end
