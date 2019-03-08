class AddHasUsedPromoToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :has_used_promo, :boolean, default: false
  end
end
