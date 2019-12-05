module Scripts
  class PrelauncherCampaign
    def self.process_bounces(file_path)
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
    
    def self.apply_reward_credits(prelaunch_users, simulate = true)
      total_awarded = 0
      success = []
      no_user_obj = []
      stripe_failures = []
      skipped = []
      prelaunch_users.each do |p|
        valid_invs = p.invited_users.where(bounced: false).count
        prize = 0 # in cents
        
        month = 8900
        if valid_invs >= 50
          prize = month*12
        elsif valid_invs >= 25
          prize = month*3
        elsif valid_invs >= 5
          prize = 9000
        elsif valid_invs >= 1
          prize = 5000
        end
        
        if prize > 0
          if prize > p.credits_applied
            prize -= p.credits_applied
            user = User.find_by_email(p.email)
            if user.nil?
              no_user_obj << p.email
            else
              unless simulate
                begin
                  StripeService.create_account_credit(user, prize, "Prelaunch Referral Program: #{valid_invs} Invites")
                  p.credits_applied += prize
                  p.save
                  success << p.email
                  total_awarded += prize
                rescue StripeService::StripeServiceError => e
                  stripe_failures << "#{p.email} - #{e.message}"
                end
              else
                success << p.email
                total_awarded += prize
              end
            end
          else
            skipped << p.email
          end
        end
      end
      
      output =  "Total Prize Money: #{total_awarded}\n"
      output << "Successful Awards: #{success.join(", ")}\n"
      output << "Skipped (Prize already applied): #{skipped.join(", ")}\n"
      output << "No User Failures: #{no_user_obj.join(", ")}\n"
      output << "Stripe Failures: \n#{stripe_failures.join("\n")}"
      puts output
    end
  end
end