namespace :items do
  desc "Populate designers from item titles and mark landing featured items"
  task populate_designers: :environment do
    Item.find_each do |item|
      if item.designer.blank? && item.title.present?
        brand = item.title.split(' ').first
        item.update(designer: brand)
        puts "Updated item #{item.id}: designer = #{brand}"
      end
    end
    
    Item.limit(3).each do |item|
      item.update(landing_featured: true)
      puts "Set landing_featured for item #{item.id}: #{item.title}"
    end
    
    puts "Done!"
  end
end
