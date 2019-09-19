module PrelaunchersHelper
  def progress_bar(min, max, val, classes = [])
    width = (val.to_f-min)/(max.to_f-min)
    width = 0 if width < 0
    width = 1 if width > 1
    width = width*100
    
    "<div class='rewards_box progress #{classes.join(" ")}'>
      <div class='progress-bar' role='progressbar' aria-valuenow='#{val}' aria-valuemin='#{min}' aria-valuemax='#{max}' style='width: #{width}%'></div>
    </div>".html_safe
  end
end
