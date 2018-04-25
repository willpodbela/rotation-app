User.create!([
  {email: "admin1@therotation.club", password: "123456", password_confirmation: "123456", access_level: :admin},
  {email: "user1@therotation.club", password: "123456", password_confirmation: "123456", access_level: :standard},
  {email: "waitlist1@therotation.club", password: "123456", password_confirmation: "123456"},
])
Item.create!([
  {title: "Off White", description: "Shirt", quantity: 2, image_url: nil, image_file_name: "blue.png", image_content_type: "image/png", image_file_size: 314834, image_updated_at: "2018-03-09 05:12:25", subtitle: "Shirt", retail_value: "$800 Retail", color: "#1C9ED1"},
  {title: "Fear of God", description: "Shirt", quantity: 3, image_url: nil, image_file_name: "jacket.png", image_content_type: "image/png", image_file_size: 374000, image_updated_at: "2018-03-09 05:12:39", subtitle: "Shirt", retail_value: "$800 Retail", color: "#6BC91A"},
  {title: "Supreme", description: "Shirt", quantity: 3, image_url: nil, image_file_name: "yellow.png", image_content_type: "image/png", image_file_size: 354607, image_updated_at: "2018-03-09 05:12:10", subtitle: "Shirt", retail_value: "$800 Retail", color: "#FFE86B"},
  {title: "Kith", description: "Hoodie", quantity: 3, image_url: nil, image_file_name: "bomber.png", image_content_type: "image/png", image_file_size: 269432, image_updated_at: "2018-03-09 05:14:17", subtitle: "Bomber", retail_value: "$800 Retail", color: "#42aaf4"},
  {title: "Stone Island", description: "This is a t-shirt.", quantity: 3, image_url: nil, image_file_name: "SI68152NS92.V1064-1.progressive.jpg", image_content_type: "image/jpeg", image_file_size: 463875, image_updated_at: "2018-03-16 22:01:08", subtitle: "T-Shirt", retail_value: "$120 Retail", color: "#aaaaaa"},
  {title: "Stone Island", description: "Stone Island Nylon Metal Jacket Ink", quantity: 4, image_url: nil, image_file_name: "SI6815314WA.V0129-8.progressive.jpg", image_content_type: "image/jpeg", image_file_size: 263606, image_updated_at: "2018-03-16 22:02:12", subtitle: "Jacket", retail_value: "$358 Retail", color: "#272f63"}
])