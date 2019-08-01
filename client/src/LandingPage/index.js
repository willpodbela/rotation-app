import React, { Component } from "react"
import { Link } from "react-router-dom"

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
            {/* <img style="top: 0px;" srcset="<%= asset_path 'rotation-app@1x.png' <%> 1x, <%= asset_path 'rotation-app@2x.png' <%> 2x" src="<%= asset_path 'rotation-app@1x.png' <%>" className="left470 bg" alt="" /> */}
          </div>
        </header>

        {/* Feature 1 */}

        <section className="feature_1 padding_top80 padding_bottom50">
          <div className="container nopadding max_width970">
            <h2 className="font42 ubuntu light dark_gray text_center">How It Works</h2>
            <div className="top70 inner">
              <div className="col-sm-4 text_center bottom50 block">
                <i className="fa fa-shopping-bag font60 light_gray"></i>
                <div className="top20 font28 light dark_gray title">Rent 2 Items
                  <br />At a Time</div>
                <div className="top30 font18 light dark_blue text">
                  Choose the latest styles from
                  <br />100+ top brands.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block">
                <i className="fa fa-box-open font60 light_gray"></i>
                <div className="top20 font28 light dark_gray title">Delivered to
                  <br />Your Home</div>
                <div className="top30 font18 light dark_blue text">
                  Add a piece to your "rotation" and we'll notify you when it's at your door.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block">
                <i className="fa fa-recycle font60 light_gray"></i>
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
                {/* <img srcset="<%= asset_path 'Acne_Studios_logo@0,5x.png' <%> 1x, <%= asset_path 'Acne_Studios_logo.png' <%> 2x" src="<%= asset_path 'Acne_Studios_logo@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'apc@0,5x.png' <%> 1x, <%= asset_path 'apc.png' <%> 2x" src="<%= asset_path 'apc@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'bape@0,5x.png' <%> 1x, <%= asset_path 'bape.png' <%> 2x" src="<%= asset_path 'bape@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'fearofgod_logo@0,5x.png' <%> 1x, <%= asset_path 'fearofgod_logo.png' <%> 2x" src="<%= asset_path 'fearofgod_logo@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right">
                {/* <img srcset="<%= asset_path 'offwhite@0,5x.png' <%> 1x, <%= asset_path 'offwhite.png' <%> 2x" src="<%= asset_path 'offwhite@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_left">
                {/* <img srcset="<%= asset_path 'palace@0,5x.png' <%> 1x, <%= asset_path 'palace.png' <%> 2x" src="<%= asset_path 'palace@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'raf@0,5x.png' <%> 1x, <%= asset_path 'raf.png' <%> 2x" src="<%= asset_path 'raf@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'stone-island@0,5x.png' <%> 1x, <%= asset_path 'stone-island.png' <%> 2x" src="<%= asset_path 'stone-island@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center">
                {/* <img srcset="<%= asset_path 'supreme@0,5x.png' <%> 1x, <%= asset_path 'supreme.png' <%> 2x" src="<%= asset_path 'supreme@0,5x.png' <%>" className="max_width_full" alt="" /> */}
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right">
                {/* <img srcset="<%= asset_path 'Yeezy-Logo@1x.png' <%> 1x, <%= asset_path 'Yeezy-Logo@2x.png' <%> 2x" src="<%= asset_path 'Yeezy-Logo@1x.png' <%>" className="max_width_full" alt="" /> */}
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
