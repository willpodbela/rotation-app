desc "Set landing_featured on first 3 items"
task set_landing_featured: :environment do
  Item.order(:id).limit(3).update_all(landing_featured: true)
  puts "Set landing_featured=true for first 3 items"
end
