namespace :items do
  desc "Mark first 3 items as landing featured (designer is derived from title)"
  task set_landing_featured: :environment do
    Item.limit(3).each do |item|
      item.update(landing_featured: true)
      puts "Set landing_featured for item #{item.id}: #{item.title}"
    end
    
    puts "Done!"
  end
end
