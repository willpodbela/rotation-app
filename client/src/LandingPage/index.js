import React, { Component } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class LandingPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: []
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    fetch("/api/v1/all_items")
      .then(results => {
        results.json()
          .then(results => {
            this.setState({items: results.items})
          })
      })
  }

  render(){
    return (
      <div className="LandingPage">
        <header className="header_11">
          <div className="container padding_sides50">
            <div className="max_width470 inner">
              <h1 className="ubuntu font62 dark_gray">Welcome<br /> to a closet without boundaries</h1>
              <div className="font22 light dark_blue top50 text">
                This is The Rotation. A members-only club that gives you access to an extensive designer wardrobe, for a fraction of the price. Everything you could want, right at your fingertips.
              </div>
              <div className="max_width570 left_block">
                <form id="landing-form" className="max_width470 text_center top80 header_3_form">
                  <input id="email" name="email" type="email" className="input width_full size60 radius6" placeholder="Email Address" required/>
                  <input id="password" name="password" type="password" className="input width_full size60 radius6 top30" placeholder="Password" required/>
                  <input id="password_confirmation" name="password_confirmation" type="password" className="input width_full size60 radius6 top30" placeholder="Confirm" required/>
                  <button type="submit" className="btn width_full size60 blue radius6 top30">Create an Account</button>
                </form>
                  <div className="top30 medium_gray text text_center">By signing up, you agree to the <Link to="/">Terms of Service</Link></div>
              </div>
            </div>
            <img style={{top: "0px"}} srcSet={"../images/rotation-app@1x.png 1x, ../images/rotation-app@2x.png 2x"} src={"../images/rotation-app@1x.png"} className="left470 bg" alt="" />
          </div>
        </header>
        
        <section className="feature_1 padding_top80 padding_bottom50">
          <h2 className="font42 ubuntu light dark_gray text_center padding_bottom50">What's In Store</h2>
          <div className="scrolling-wrapper-flexbox">
            <div className="padding_left50"></div>
            {this.state.items.map((item, index) => {
              return (
                <div key={index} className="card max_width150 padding_sides20">
                  <div className="item_card flex align_center justify_center">
                    <img className="max_width130 item_image" src={item.image_url} alt="" />
                  </div>
                  <div className="brand padding_top10">{item.title}</div>
                  <div className="description padding_top5">{item.description.toLowerCase()}</div>
                </div>
              )
            })}
            <div className="padding_right50"></div>
          </div>
        </section>

        <hr width="50%" />

        {/* Feature 1 */}
        <section className="feature_1 padding_top80 padding_bottom50">
          <div className="container max_width970 margin_auto">
            <h2 className="font42 ubuntu light dark_gray text_center">How It Works</h2>
            <div className="top70 inner flex justify_around">
              <div className="col-sm-4 text_center bottom50 block width300">
                <FontAwesomeIcon className="fa font60 light_gray" icon="shopping-bag" />
                <div className="top20 font28 light dark_gray title">Rent 2 Items
                  <br />At a Time</div>
                <div className="top30 font18 light dark_blue text">
                  Choose the latest styles from
                  <br />100+ top brands.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block width300">
                <FontAwesomeIcon className="fa font60 light_gray" icon="box-open" />
                <div className="top20 font28 light dark_gray title">Delivered to
                  <br />Your Home</div>
                <div className="top30 font18 light dark_blue text">
                  Add a piece to your "rotation" and we'll notify you when it's at your door.
                </div>
              </div>
              <div className="col-sm-4 text_center bottom50 block width300">
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

        <hr width="50%" />

        {/* Content 35 */}
        <section className="content_35 padding_bottom50">
          <div className="container nopadding">
            <div className="text_center max_width970 margin_auto">
              <div className="top100 bottom100 text_center inner">
                <div className="font14 dark_blue semibold uppercase pretitle spacing17">OUR CATALOG</div>
                <h2 className="font42 black top30 light ubuntu">From Traditional Designers <br />to Modern Streetwear</h2>
              </div>
              <div className="inline_block bottom50 width190 text_left vertical_middle">
                <img srcSet={"../images/Acne_Studios_logo@0,5x.png 1x, ../images/Acne_Studios_logo.png 2x"} src={"../images/Acne_Studios_logo@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/apc@0,5x.png 1x, ../images/apc.png 2x"} src={"../images/apc@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/bape@0,5x.png 1x, ../images/bape.png 2x"} src={"../images/bape@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/fearofgod_logo@0,5x.png 1x, ../images/fearofgod_logo.png 2x"} src={"../images/fearofgod_logo@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right vertical_middle">
                <img srcSet={"../images/offwhite@0,5x.png 1x, ../images/offwhite.png 2x"} src={"../images/offwhite@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_left vertical_middle">
                <img srcSet={"../images/palace@0,5x.png 1x, ../images/palace.png 2x"} src={"../images/palace@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/raf@0,5x.png 1x, ../images/raf.png 2x"} src={"../images/raf@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/stone-island@0,5x.png 1x, ../images/stone-island.png 2x"} src={"../images/stone-island@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_center vertical_middle">
                <img srcSet={"../images/supreme@0,5x.png 1x, ../images/supreme.png 2x"} src={"../images/supreme@0,5x.png"} className="max_width_full" alt="" />
              </div>
              <div className="inline_block margin_auto bottom50 width190 text_right vertical_middle">
                <img srcSet={"../images/Yeezy-Logo@1x.png 1x, ../images/Yeezy-Logo@2x.png 2x"} src={"../images/Yeezy-Logo@1x.png"} className="max_width_full" alt="" />
              </div>
            </div>
          </div>
        </section>

        <hr width="50%" />

        {/* Pricing Table 7 */}
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
              <Link to="/status" id="price-btn" className="top45 min_width170 btn size60 transparent_blue border border_blue radius6 font16">Try for $49/mo</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default LandingPage
