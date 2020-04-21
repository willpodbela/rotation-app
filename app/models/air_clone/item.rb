module AirClone
  class Item < Base
  
    def clone_attributes
      copy_columns = [ "title", "description", "created_at", "updated_at", "subtitle", "color", "hidden", "landing_featured", "category", "sub_category", "meta_category", "supplier_color" ]
      hash = @local.attributes.select {|key, value| copy_columns.include?(key) }
      hash["image"] = [{ url: "http:#{@local.image.url}" }]
      return hash
    end
    
  end
end