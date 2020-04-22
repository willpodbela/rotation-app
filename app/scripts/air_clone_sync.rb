module Scripts
  class AirCloneSync
    # Quick and dirty script to do a one time database dump into Airtable. Highly suggest 
    # only using with and empty base, as we skip all duplication safety checks.
    def self.create_all
      [ Reservation.includes(:unit, :item) ].each { |klass|
        klass.find_each do |record|
          clone = "AirClone::#{record.class.name}".constantize.new({})
          clone.instance_variable_set(:@local, record)
          clone.sync
        end
      }
    end
  end
end