class PopulateItemDesigners < ActiveRecord::Migration[6.0]
  def change
    Item.find_each do |item|
      if item.designer.blank? && item.title.present?
        brand = item.title.split(' ').first
        item.update_column(:designer, brand)
      end
    end
    
    # Set first 3 items as landing featured
    Item.limit(3).each { |item| item.update_column(:landing_featured, true) }
  end
end
