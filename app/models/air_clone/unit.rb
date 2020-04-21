module AirClone
  class Unit < Base
  
    def clone_attributes
      copy_columns = [ "size", "supplier", "supplier_order_id", "order_date", "status", "created_at", "updated_at", "retire_date", "notes", "rfid_tag_id" ]
      hash = @local.attributes.select {|key, value| copy_columns.include?(key) }
      hash["cost"] = @local.cost.to_f
      hash["supplier_shipping_cost"] = @local.supplier_shipping_cost.to_f
      unless @local.item.nil?
        hash["Item"] = [AirClone::Item.find_or_create_with_rails_record(@local.item)&.id]
      end
      return hash
    end
    
  end
end