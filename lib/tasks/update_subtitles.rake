namespace :items do
  desc "Update subtitles with designer names extracted from titles"
  task update_subtitles: :environment do
    subtitles = {
      "Off White Shirt" => "Off White",
      "Supreme Hoodie" => "Supreme",
      "Kith Pants" => "Kith",
      "Comme des Garçons Play T-Shirt" => "Comme des Garçons",
      "Stone Island T-Shirt" => "Stone Island",
      "Acne Studios Nash Oversized T-Shirt" => "Acne Studios",
      "Fear of God Jacket" => "Fear of God",
      "Stone Island Nylon Jacket" => "Stone Island",
      "Nike Air Force 1 Low" => "Nike",
      "Carhartt WIP Detroit Jacket" => "Carhartt WIP"
    }

    subtitles.each do |title, subtitle|
      item = Item.find_by(title: title)
      if item
        item.update(subtitle: subtitle)
        puts "Updated #{title} -> #{subtitle}"
      else
        puts "NOT FOUND: #{title}"
      end
    end

    puts "Done!"
  end
end
