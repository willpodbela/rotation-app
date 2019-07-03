module Scripts
  class Promotions
    def self.fourth_of_july
      msg = "Celebrate 1776 Brexit with some new threads. 🇺🇸 Now through July 9th, get your first month for $20. 💥"
      code = ReferralCode.find_or_create_by({:id => "4THJULY", :description => "4th of July promotional code"})
      amt_off = 3000
      priority_codes = ["FRIENDSNFAMILY", "TESTCODE"]
      users = (User.standard - User.paying_customers)
      
      if code.coupon.nil?
        StripeService.create_coupon(code, {:duration=>"once", :amount_off=>amt_off, :currency=>"usd"})
      end
      self.send_promotion(users, msg, code, priority_codes)
    end
    
    def self.send_promotion(users, message, referral_code, priority_codes = [])
      segmentation_output = "email\n"
      users.each do |user|
        if user.referral_code.nil?
          user.referral_code = referral_code
          user.save
        else
          unless user.referral_code.id.in? priority_codes
            user.referral_code = referral_code
            user.save
          end
        end
        
        user.send_notification(message)
        
        segmentation_output << user.email
        segmentation_output << "\n"
      end
      
      # If script is run through a rails runner, emails of targeted users will be written to a local csv file for use with an tandam email campaign
      puts segmentation_output
    end
  end
end