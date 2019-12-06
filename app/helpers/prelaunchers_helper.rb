require 'uri'

module PrelaunchersHelper
  def progress_bar(min, max, val, classes = [])
    width = (val.to_f-min)/(max.to_f-min)
    width = 0 if width < 0
    width = 1 if width > 1
    width = width*100
    
    "<div class='rewards_box progress #{classes.join(' ')}'>
      <div class='progress-bar' role='progressbar' aria-valuenow='#{val}' aria-valuemin='#{min}' aria-valuemax='#{max}' style='width: #{width}%'></div>
    </div>".html_safe
  end
  
  def twitter_share_button(text, invite_url)
    "<a href='http://twitter.com/share?url=#{URI.encode(invite_url)}&text=#{URI.encode(text)}' class='share_link flex justify_center align_center'>
      <i class='fab fa-twitter line_height50 invite_friends_icon'></i>SHARE
    </a>".html_safe
  end
  
  def sms_share_button(text, invite_url)
    "<a href='sms:+1&body=#{URI.encode([text, invite_url].compact.join(" "))}' class='share_link flex justify_center align_center'>
      <i class='fa fa-comment line_height50 invite_friends_icon'></i>SEND SMS
    </a>".html_safe
  end
end
