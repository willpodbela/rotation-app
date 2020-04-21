class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  
  # TODO: Can we move this logic into the air_clone module somehow? Similar to how
  # "devise :confirmable" also users to add extra functionality to a model.
  def self.aircloneable
    self.define_method(:airclone) do
      "AirClone::#{self.class.name}".constantize.find_or_create_with_rails_record(self)
    end
    
    self.set_callback :save, :after do
      begin
        self.airclone.sync
      rescue 
        # Silently fail all AirClone Errors
      end
    end
    
    self.set_callback :destroy, :after do
      begin
        self.airclone.destroy
      rescue 
        # Silently fail all AirClone Errors
      end
    end
  end
end
