module Scripts
  class EmailBlaster
    def self.send(template, users)
      users.each do |user|
        CustomerFeedbackMailer.with(user: user).public_send(template).deliver_later
      end
      puts "#{users.count} emails sent!"
    end
  end
end