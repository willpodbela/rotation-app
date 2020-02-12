module Scripts
  class InventoryImport
    require 'csv'
  
    def self.load_items(file_path)
      success = 0
      output = ""
      
      CSV.foreach(file_path, headers: true, header_converters: :symbol) do |line|
        i = Item.new(line.to_hash)
        i.virtual_qty = 0
           
        if i.save
          success += 1
        else
          output << "Failed to create item: #{line.to_hash}\n"          
        end
      end
      
      output << "Succesfully added #{success} items."
      puts output
    end
    
    def self.load_units(file_path)
      success = 0
      output = ""
      
      CSV.foreach(file_path, headers: true, header_converters: :symbol) do |line|
        item_keyset = [:title, :subtitle, :color, :supplier_color]
        item, unit = line.to_hash.partition {|k,v| item_keyset.include? k }
        unit = Hash[unit]
        item = Hash[item]
        
        i = Item.where(item).take      
        if i.nil?
          output << "Failed to find item: #{line.to_hash}\n"   
          
        else
          u = Unit.new(unit)
          u.item = i
          if u.save
            success += 1
          else
            output << "Failed to create unit: #{line.to_hash}\n"
          end
        end
      end
      
      output << "Succesfully added #{success} items."
      puts output
    end
  end
end