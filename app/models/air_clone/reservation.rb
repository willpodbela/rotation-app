module AirClone
  class Reservation < Base
  
    def clone_attributes
      copy_columns = [ "user_id", "size", "status", "start_date", "end_date", "created_at", "updated_at" ]
      hash = @local.attributes.select {|key, value| copy_columns.include?(key) }
      unless @local.item.nil?
        clone_id = AirClone::Item.find_or_create_with_rails_record(@local.item)&.id
        hash["Item"] = [clone_id] unless clone_id.nil?
      end
      unless @local.unit.nil?
        clone_id = AirClone::Item.find_or_create_with_rails_record(@local.unit)&.id
        hash["Unit"] = [clone_id] unless clone_id.nil?
      end
      return hash
    end
    
  end
end