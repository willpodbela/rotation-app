# Create or find users
admin_user = User.find_or_create_by(email: "admin1@therotation.club") do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
  user.access_level = :admin
end

standard_user = User.find_or_create_by(email: "user1@therotation.club") do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
  user.access_level = :standard
end

waitlist_user = User.find_or_create_by(email: "waitlist1@therotation.club") do |user|
  user.password = "123456"
  user.password_confirmation = "123456"
end

# Create sample items - items must have image_file_name to be visible in catalog
sample_items = [
  {title: "Off White Shirt", subtitle: "Blue Shirt", retail_value: "$800", hidden: false, category: "Tops", sub_category: "T-Shirts", color: "#1C9ED1", image_file_name: "placeholder.jpg"},
  {title: "Fear of God Jacket", subtitle: "Brown Jacket", retail_value: "$1200", hidden: false, category: "Outerwear", sub_category: "Jackets", color: "#8B4513", image_file_name: "placeholder.jpg"},
  {title: "Supreme Hoodie", subtitle: "Red Hoodie", retail_value: "$600", hidden: false, category: "Tops", sub_category: "Hoodies", color: "#FF0000", image_file_name: "placeholder.jpg"},
  {title: "Kith Pants", subtitle: "Black Trousers", retail_value: "$350", hidden: false, category: "Bottoms", sub_category: "Trousers", color: "#000000", image_file_name: "placeholder.jpg"},
  {title: "Stone Island T-Shirt", subtitle: "Gray T-Shirt", retail_value: "$120", hidden: false, category: "Tops", sub_category: "T-Shirts", color: "#808080", image_file_name: "placeholder.jpg"},
  {title: "Stone Island Nylon Jacket", subtitle: "Navy Jacket", retail_value: "$358", hidden: false, category: "Outerwear", sub_category: "Jackets", color: "#000080", image_file_name: "placeholder.jpg"},
]

sample_items.each do |item_attrs|
  Item.find_or_create_by(title: item_attrs[:title]) do |item|
    item.update(item_attrs)
  end
end

puts "Seeding complete!"

