class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  
  class << self
    # TODO: Can we move this logic into the air_clone module somehow? Similar to how
    # "devise :confirmable" allows users to attach functionality to their a model.
    def aircloneable
      define_method(:airclone) do
        "AirClone::#{self.class.name}".constantize.find_or_create_with_rails_record(self)
      end
  
      set_callback :save, :after do
        begin
          airclone.sync
        rescue 
          # Silently fail all AirClone Errors
        end
      end
  
      set_callback :destroy, :after do
        begin
          airclone.destroy
        rescue 
          # Silently fail all AirClone Errors
        end
      end
    end
  end
end
