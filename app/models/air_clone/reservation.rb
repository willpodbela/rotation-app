module AirClone
  class Reservation < Base
  
    def clone_attributes
      copy_columns = [ "user_id", "size", "status", "start_date", "end_date", "created_at", "updated_at" ]
      hash = @local.attributes.select {|key, value| copy_columns.include?(key) }
      unless @local.item.nil?
        hash["Item"] = [AirClone::Item.find_or_create_with_rails_record(@local.item)&.id]
      end
      unless @local.unit.nil?
        hash["Unit"] = [AirClone::Unit.find_or_create_with_rails_record(@local.unit)&.id]
      end
      return hash
    end
    
  end
end