import React, { Component }  from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import "./style.css"

class PricingTable extends Component {
  render(){
    return (
      <div className="PricingTable">
        <section className="padding_bottom100 text_center">
          <div className="spacing10 proxima_small semibold rotation_gray padding_bottom15 uppercase">Plan + Pricing</div>
          <div className="subscribe_to_the_closet line_height30 medium druk_medium rotation_gray padding_bottom15 margin_auto">Subscribe to the closet of your future</div>
          <div className="proxima_large medium rotation_gray text_center">We've got three plans to choose from.</div>
          <div className="padding_bottom30 padding_top30 flex justify_center">
            <div className="sides30 top10 bottom10 flex">
              <div className="pricing_rectangle flex align_center justify_center">
                <div>
                  <div className="medium druk_medium rotation_gray">2</div>
                  <div className="spacing10 line_height16 proxima_small semibold rotation_gray uppercase">Pieces at a Time</div>
                </div>
              </div>
              <div className="pricing_rectangle flex align_center justify_center rotation_gray_background">
                <div>
                  <div className="medium druk_medium white">$89</div>
                  <div className="spacing10 line_height16 proxima_small semibold white uppercase">per month</div>
                </div>
              </div>
            </div>
            <div className="sides30 top10 bottom10 flex">
              <div className="pricing_rectangle flex align_center justify_center">
                <div>
                  <div className="medium druk_medium rotation_gray">3</div>
                  <div className="spacing10 line_height16 proxima_small semibold rotation_gray uppercase">Pieces at a Time</div>
                </div>
              </div>
              <div className="pricing_rectangle flex align_center justify_center rotation_gray_background">
                <div>
                  <div className="medium druk_medium white">$129</div>
                  <div className="spacing10 line_height16 proxima_small semibold white uppercase">per month</div>
                </div>
              </div>
            </div>
            <div className="sides30 top10 bottom10 flex">
              <div className="pricing_rectangle flex align_center justify_center">
                <div>
                  <div className="medium druk_medium rotation_gray">4</div>
                  <div className="spacing10 line_height16 proxima_small semibold rotation_gray uppercase">Pieces at a Time</div>
                </div>
              </div>
              <div className="pricing_rectangle flex align_center justify_center rotation_gray_background">
                <div>
                  <div className="medium druk_medium white">$159</div>
                  <div className="spacing10 line_height16 proxima_small semibold white uppercase">per month</div>
                </div>
              </div>
            </div>
          </div>
          <div className="padding_bottom20">
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">Founder pricing for first 100 members only.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">We handle the dry-cleaning.</div>
              </div>
            </div>
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">Swap individual pieces anytime.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">New drops every 2 weeks.</div>
              </div>
            </div>
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">Choose pieces from the world’s top men’s designer brands.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon rotation_gray font26 flex justify_center" icon="check-square" /></div>
                <div className="line_height20 proxima_large text_left width250 medium rotation_gray">Keep pieces for as long or as little as you want.</div>
              </div>
            </div>
          </div>
          <div className="join_waitlist_btn rotation_gray_background margin_auto flex cursor_pointer">
            <Link to="/catalog" className="spacing10 line_height10 proxima_small semibold white flex align_center margin_auto uppercase">Join Now</Link>
          </div>
        </section>
      </div>
    )
  }
}

export default PricingTable
