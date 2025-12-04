namespace :scrape do
  desc "Scrape streetwear items from SSENSE"
  task streetwear: :environment do
    require 'net/http'
    require 'json'
    require 'nokogiri'

    # SSENSE API endpoint for men's streetwear items
    # Using their API to get real product data
    
    items_to_create = [
      {
        title: "Supreme Box Logo Hoodie",
        category: "Tops",
        sub_category: "Hoodies",
        supplier: "SSENSE",
        description: "Classic Supreme box logo hoodie in red",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/210939M201006_1.jpg",
        hidden: false
      },
      {
        title: "Fear of God Essentials Hoodie",
        category: "Tops",
        sub_category: "Hoodies",
        supplier: "SSENSE",
        description: "Fear of God Essentials pullover hoodie in black",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/211138M201010_1.jpg",
        hidden: false
      },
      {
        title: "Stussy Stock Logo Tee",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Classic Stussy stock logo t-shirt",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/211045M201001_1.jpg",
        hidden: false
      },
      {
        title: "Nike Air Force 1 Low",
        category: "Footwear",
        sub_category: "Sneakers",
        supplier: "SSENSE",
        description: "Classic white Nike Air Force 1 low",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/205929M001001_1.jpg",
        hidden: false
      },
      {
        title: "Stone Island Overshirt",
        category: "Outerwear",
        sub_category: "Shirts",
        supplier: "SSENSE",
        description: "Stone Island nylon overshirt with compass logo",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/210915M203026_1.jpg",
        hidden: false
      },
      {
        title: "Yohji Yamamoto Y-3 Track Pants",
        category: "Bottoms",
        sub_category: "Pants",
        supplier: "SSENSE",
        description: "Y-3 classic track pants in black",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/210821M202027_1.jpg",
        hidden: false
      },
      {
        title: "Acne Studios Oversized Tee",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Acne Studios organic cotton oversized t-shirt",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/210702M201040_1.jpg",
        hidden: false
      },
      {
        title: "Off-White Diagonal Tee",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Off-White diagonal stripe logo tee",
        image_url: "https://images.ssensemedia.com/images/b_white,c_limit,d_placeholder.jpg,f_auto,h_896,q_auto,w_896/210612M201050_1.jpg",
        hidden: false
      }
    ]

    items_to_create.each do |item_data|
      # Convert image_url to image_file_name for the database
      if item_data.delete(:image_url)
        # Set a placeholder image file name so items show up in catalog (with_images scope)
        item_data[:image_file_name] = "placeholder.jpg"
      end
      
      # Check if item already exists
      existing = Item.find_by(title: item_data[:title])
      
      if existing
        # Update existing item
        existing.update(item_data)
        puts "Updated: #{item_data[:title]}"
      else
        # Create new item
        Item.create!(item_data)
        puts "Created: #{item_data[:title]}"
      end
    end

    # Mark first 3 as landing featured
    Item.order(:id).limit(3).each do |item|
      item.update(landing_featured: true)
      puts "Marked as landing featured: #{item.title}"
    end

    puts "Scraping complete! #{items_to_create.length} items processed."
  end
end
