module Scripts
  class ProcessPrelaunchBounces
    def self.process(file_path)
      success = 0
      fail = 0
      File.open(file_path).each do |line|
        u = PrelaunchUser.find_by_email(line.gsub("\r", '').gsub("\n", ''))
        if u.nil?
          fail += 1
        else
          u.bounced = true
          u.save
          success += 1
        end
      end
      
      return "Succesfully marked #{success} emails bounced. Failed to find #{fail} emails in the database."
    end
  end
end