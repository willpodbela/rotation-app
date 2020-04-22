Airrecord.api_key = ENV['AIRTABLE_API_KEY']

module AirClone
  class Error < StandardError; end
  
  class Base < Airrecord::Table
  
    attr_reader :local
        
    def self.find_or_create_with_rails_record(local_record)
      record = find_by_rails_id(local_record.id)
      if record.nil?
        record = self.new({})
      end
      # We force set local in order to skip the safety check on line 39 since we just did 
      # that exact call on line 11. Saves an API call.
      record.instance_variable_set(:@local, local_record)
      return record
    end
    
    def self.find_by_rails_id(id)
      all(filter: "{rails_id} = #{id}").first
    end
    
    def self.base_key
      ENV['AIRTABLE_BASE_ID']
    end
      
    def self.table_name
      self.name.demodulize.pluralize
    end
    
    # Local record can be passed in on initialization if we already have it to avoid additional database call
    def initialize(fields = {}, id: nil, created_at: nil, local: nil)
      super(fields, id: id, created_at: created_at)
    end
    
    def local=(record)
      # Throw error if the local record already has an associated AirTable record
      if !self.class.find_by_rails_id(record.id).nil?
        raise AirClone::Error, "Associated record already exists in AirTable (#{self.class.table_name}, rails_id: #{record.id}). Use find_or_create_with_rails_record to retrive existing record."
      else
        @local=record
      end
    end
    
    # Overwrite the AirTable record fields with local record attributes
    def sync
      if @local.nil?
        raise AirClone::Error, "Local record is nil."
      else
        attributes = clone_attributes
        attributes["rails_id"] = @local.id
        attributes.each { |k, v| self[k] = v }
        save
      end
    end
    
    protected
    
    # Returns hash of attributes built from the local record to be written to AirTable clone
    # Allows the model to determine which of its attributes should be written and modify or 
    # transpose those attributes.
    # Override this method in each AirClone model class.
    # @return [Hash]
    def clone_attributes
      {}
    end
    
  end
end