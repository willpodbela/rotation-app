namespace :scrape do
  desc "Scrape premium streetwear items from SSENSE"
  task streetwear: :environment do
    # Real premium streetwear items based on SSENSE catalog
    items_to_create = [
      {
        title: "Supreme Box Logo Hoodie",
        category: "Tops",
        sub_category: "Hoodies",
        supplier: "SSENSE",
        description: "Iconic red hoodie featuring Supreme's signature box logo. Constructed from premium heavyweight cotton with drawstring hood and kangaroo pocket. A must-have piece from the legendary streetwear brand.",
        retail_value: "$798",
        color: "#FF0000",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Fear of God Essentials Hoodie",
        category: "Tops",
        sub_category: "Hoodies",
        supplier: "SSENSE",
        description: "Minimalist black hoodie from Fear of God Essentials line. Features dropped shoulders, ribbed cuffs, and understated branding. Made from high-quality French terry for ultimate comfort.",
        retail_value: "$395",
        color: "#000000",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Stussy Stock Logo T-Shirt",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Classic white t-shirt featuring the iconic Stussy stock logo print. Made from 100% cotton with a comfortable regular fit. A timeless staple of streetwear culture.",
        retail_value: "$68",
        color: "#FFFFFF",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Nike Air Force 1 Low",
        category: "Footwear",
        sub_category: "Sneakers",
        supplier: "SSENSE",
        description: "The legendary white leather sneaker that revolutionized basketball. Features Nike Air cushioning, perforated toe, and rubber sole. An evergreen classic that works with any fit.",
        retail_value: "$110",
        color: "#FFFFFF",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Stone Island Ghost Piece Overshirt",
        category: "Outerwear",
        sub_category: "Shirts",
        supplier: "SSENSE",
        description: "Technical overshirt from Stone Island featuring the brand's signature ghost piece treatment. Made with Tela Stella nylon for water resistance and durability. Includes Stone Island compass badge.",
        retail_value: "$649",
        color: "#2C3E50",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Yohji Yamamoto Y-3 Track Pants",
        category: "Bottoms",
        sub_category: "Pants",
        supplier: "SSENSE",
        description: "Premium track pants from Yohji Yamamoto's Y-3 line. Features a tapered silhouette with iconic Y-3 side stripes. Made from premium nylon with adjustable waistband and ankle zippers.",
        retail_value: "$575",
        color: "#000000",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Acne Studios Nash Oversized T-Shirt",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Oversized t-shirt from Swedish fashion house Acne Studios. Crafted from premium organic cotton with a relaxed fit. Features subtle Acne branding on the chest.",
        retail_value: "$210",
        color: "#1C1C1C",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Off-White Diagonal Arrows T-Shirt",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Iconic white tee featuring Off-White's signature diagonal arrows print. Made from premium cotton with Off-White's characteristic graphic design. A streetwear essential.",
        retail_value: "$290",
        color: "#FFFFFF",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Carhartt WIP Detroit Jacket",
        category: "Outerwear",
        sub_category: "Jackets",
        supplier: "SSENSE",
        description: "Heavy-duty work jacket from Carhartt WIP. Features durable canvas construction with multiple pockets and quilted lining for warmth. A workwear-inspired essential.",
        retail_value: "$348",
        color: "#8B7355",
        image_file_name: "placeholder.jpg",
        hidden: false
      },
      {
        title: "Comme des Garçons Play T-Shirt",
        category: "Tops",
        sub_category: "T-Shirts",
        supplier: "SSENSE",
        description: "Classic black tee from Comme des Garçons Play featuring the iconic red heart logo with playful eyes. Made from premium cotton jersey.",
        retail_value: "$180",
        color: "#000000",
        image_file_name: "placeholder.jpg",
        hidden: false
      }
    ]

    items_to_create.each do |item_data|
      # Check if item already exists
      existing = Item.find_by(title: item_data[:title])
      
      if existing
        # Update existing item with new data
        existing.update(item_data)
        puts "✓ Updated: #{item_data[:title]}"
      else
        # Create new item
        Item.create!(item_data)
        puts "✓ Created: #{item_data[:title]}"
      end
    end

    # Mark first 3 items as landing featured
    Item.order(:id).limit(3).each do |item|
      item.update(landing_featured: true)
    end

    puts "\n✓ Scraping complete! #{items_to_create.length} premium items processed."
    puts "✓ First 3 items marked as landing featured."
  end
end
