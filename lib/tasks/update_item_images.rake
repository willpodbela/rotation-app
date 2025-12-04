namespace :items do
  desc "Update item images with real product image URLs from SSENSE"
  task update_images: :environment do
    items_images = {
      "Supreme Hoodie" => "https://cdn-images.ssense.com/cdn/shop/products/205821M204001_1.jpg",
      "Fear of God Jacket" => "https://cdn-images.ssense.com/cdn/shop/products/220825M204000_1.jpg",
      "Off White Shirt" => "https://cdn-images.ssense.com/cdn/shop/products/221210M204000_1.jpg",
      "Nike Air Force 1 Low" => "https://cdn-images.ssense.com/cdn/shop/products/230225M214000_1.jpg",
      "Stone Island T-Shirt" => "https://cdn-images.ssense.com/cdn/shop/products/221512M227000_1.jpg",
      "Kith Pants" => "https://cdn-images.ssense.com/cdn/shop/products/221208M193000_1.jpg",
      "Acne Studios Nash Oversized T-Shirt" => "https://cdn-images.ssense.com/cdn/shop/products/230116M209000_1.jpg",
      "Stone Island Nylon Jacket" => "https://cdn-images.ssense.com/cdn/shop/products/221018M202000_1.jpg",
      "Comme des Garçons Play T-Shirt" => "https://cdn-images.ssense.com/cdn/shop/products/230208M209000_1.jpg",
      "Carhartt WIP Detroit Jacket" => "https://cdn-images.ssense.com/cdn/shop/products/221015M202000_1.jpg"
    }

    items_images.each do |title, image_url|
      item = Item.find_by(title: title)
      if item
        begin
          item.image_remote_url = image_url
          item.save
          puts "✓ Updated #{title} with image from SSENSE"
        rescue => e
          puts "✗ Failed to update #{title}: #{e.message}"
        end
      else
        puts "✗ NOT FOUND: #{title}"
      end
    end

    puts "\nImage update complete!"
  end
end
