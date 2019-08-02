import React, { Component } from "react"
import { Link } from "react-router-dom"
import Rotation1 from "../images/rotation-app@1x.png"
import Rotation2 from "../images/rotation-app@2x.png"
import Acne1 from "../images/Acne_Studios_logo@0,5x.png"
import Acne2 from "../images/Acne_Studios_logo.png"
import Apc1 from "../images/apc@0,5x.png"
import Apc2 from "../images/apc.png"
import Bape1 from "../images/bape@0,5x.png"
import Bape2 from "../images/bape.png"
import FearOfGod1 from "../images/fearofgod_logo@0,5x.png"
import FearOfGod2 from "../images/fearofgod_logo.png"
import OffWhite1 from "../images/offwhite@0,5x.png"
import OffWhite2 from "../images/offwhite.png"
import Palace1 from "../images/palace@0,5x.png"
import Palace2 from "../images/palace.png"
import Raf1 from "../images/raf@0,5x.png"
import Raf2 from "../images/raf.png"
import StoneIsland1 from "../images/stone-island@0,5x.png"
import StoneIsland2 from "../images/stone-island.png"
import Supreme1 from "../images/supreme@0,5x.png"
import Supreme2 from "../images/supreme.png"
import Yeezy1 from "../images/Yeezy-Logo@1x.png"
import Yeezy2 from "../images/Yeezy-Logo@2x.png"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class LandingPage extends Component {
  constructor(props){
    super(props)
    // this.state = {
    //   results: []
    // }
  }

  render(){
    return (
      <div className="LandingPage">
        <header className="header_11">
          <div style={{paddingBottom: "148px"}} className="container nopadding">
            <div className="max_width470 inner">
              <h1 className="ubuntu font62 dark_gray">Welcome<br /> to a closet without boundaries</h1>
              <div className="font22 light dark_blue top50 text">
                This is The Rotation. A members-only club that gives you access to an extensive designer wardrobe, for a fraction of the price. Everything you could want, right at your fingertips.
              </div>
              <div className="max_width570 left_block">
                <form id="landing-form" className="max_width470 text_center top80 header_3_form">
                  <input id="email" name="email" type="email" className="width_full radius6" placeholder="Email Address" required/>
                  <input id="password" name="password" type="password" className="width_full radius6 top30" placeholder="Password" required/>
                  <input id="password_confirmation" name="password_confirmation" type="password" className="width_full radius6 top30" placeholder="Confirm" required/>
                  <button type="submit" className="btn width_full size60 blue radius6 top30">Create an Account</button>
                </form>
                {/* <%= form_tag(sign_up_path, id: "landing-form", remote: true, class: "max_width470 text_center top80 header_3_form") do <%>
                  <%= email_field_tag("email", nil, id: "email", class: "width_full radius6", placeholder: "Email Address", required: "required") =<%>
                  <%= password_field_tag("password", nil, id: "password", class: "width_full radius6 top30", placeholder: "Password", required: "required") =<%>
                  <%= password_field_tag("password_confirmation", nil, id: "password_confirmation", class: "width_full radius6 top30", placeholder: "Confirm", required: "required") <%>
                  <%= button_tag(type: "submit", class: "btn width_full size60 blue radius6 top30") do <%>
                    Create an Account
                  <% end <%> */}
                  <div className="top30 medium_gray text">By signing up, you agree to the <a href="#">Terms of Service</a></div>
                {/* <% end <%> */}
              </div>
            </div>
            <img style={{top: "0px"}} srcSet={`${Rotation1} 1x, ${Rotation2} 2x`} src={Rotation1} className="left470 bg" alt="" />
          </div>
        </header>

        {/* Feature 1 */}

        <section className="feature_1 padding_top80 padding_bottom50">
          <div className="container nopadding max_width970">
            <h2 className="font42 ubuntu light dark_gray text_center">How It Works</h2>
            <div className="top70 inner">
              <div className="col-sm-4 text_center bottom50 block">
                <FontAwesomeIcon className="fa font60 light_gray" icon="shopping-bag" />
                <div className="top20 font28 light dark_gray title">Rent 2 Items
                  <br />At a Time</div>
                <div className="top30 font18 light dark_blue text">
                  Choose the latest styles from
                  <br />100+ top brands.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block">
                <FontAwesomeIcon className="fa font60 light_gray" icon="box-open" />
                <div className="top20 font28 light dark_gray title">Delivered to
                  <br />Your Home</div>
                <div className="top30 font18 light dark_blue text">
                  Add a piece to your "rotation" and we'll notify you when it's at your door.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block">
                <FontAwesomeIcon className="fa font60 light_gray" icon="recycle" />
                <div className="top20 font28 light dark_gray title">Unlimited
                  <br />Exchanges</div>
                <div className="top30 font18 light dark_blue text">
                  Send your pieces back dirty at any time using our pre-paid shipping label.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content 35 */}
        <hr width="50%" />
        <section className="content_35 padding_bottom50">
          <div className="container nopadding">
            <div className="text_center max_width970 margin_auto">
              <div className="top100 bottom100 text_center inner">
                <div className="font14 dark_blue semibold uppercase pretitle spacing17">OUR CATALOG</div>
                <h2 className="font42 black top30 light ubuntu">From Traditional Designers <br />to Modern Streetwear</h2>
              </div>
              <div className="inline_block bottom50 width190 text_left">
                <img srcSet={`${Acne1} 1x, ${Acne2} 2x`} src={Acne1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${Apc1} 1x, ${Apc2} 2x`} src={Apc1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${Bape1} 1x, ${Bape2} 2x`} src={Bape1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${FearOfGod1} 1x, ${FearOfGod2} 2x`} src={FearOfGod1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right">
                <img srcSet={`${OffWhite1} 1x, ${OffWhite2} 2x`} src={OffWhite1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_left">
                <img srcSet={`${Palace1} 1x, ${Palace2} 2x`} src={Palace1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${Raf1} 1x, ${Raf2} 2x`} src={Raf1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${StoneIsland1} 1x, ${StoneIsland2} 2x`} src={StoneIsland1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                <img srcSet={`${Supreme1} 1x, ${Supreme2} 2x`} src={Supreme1} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right">
                <img srcSet={`${Yeezy1} 1x, ${Yeezy2} 2x`} src={Yeezy1} className="max_width_full" alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table 7 */}
        <hr width="50%" />

        <section className="pricing_table_7 padding_top70 padding_bottom110">
          <div className="container nopadding dark_blue text_center">
            <h2 className="font42 ubuntu light dark_gray">How much for no limits?</h2>
            <div className="max_width570 margin_auto top15 font18 light">
              Become a member of The Rotation for a low monthly fee.
            </div>
            <div className="max_width570 margin_auto top55 padding_sides100 padding_top55 padding_bottom70 radius10 inner">
              <div className="ubuntu light font28 dark_gray title">Founding Member</div>
              <div className="top25 font14 uppercase semibold spacing20">100 SPOTS</div>
              <div className="top30 light font16 text">
                Be the first to sign up for The Rotation and receive a special price.
              </div>
              <a id="price-btn" href="#" className="top45 min_width170 btn size60 transparent_blue border border_blue radius6 font16">Try for $49/mo</a>
              {/* <% if user_signed_in? <%>
                  <%= link_to("Try for $49/mo", status_path, class: "top45 min_width170 btn size60 transparent_blue border border_blue radius6 font16") <%>
                <% else <%>
                  <a id="price-btn" href="#" className="top45 min_width170 btn size60 transparent_blue border border_blue radius6 font16">Try for $49/mo</a>
                <% end <%> */}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default LandingPage
