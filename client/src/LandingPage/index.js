import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./style.css"
import PricingTable from "../PricingTable"

class LandingPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      landing_email: ""
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    fetch("/api/web/items", {
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(results => {
      results.json()
        .then(results => {
          this.setState({items: results.items.filter(item => item.landing_featured)})
        })
    })
  }

  addLeadEmail(e){
    console.log(this.state.landing_email)
    fetch("/api/web/users/lead", {
      method: "POST",
      body: JSON.stringify({
        "email": this.state.landing_email
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  render(){
    return (
      <div className="LandingPage">
        <header className="background flex align_center">
          <div className="left13pct">
            <div className="welcome_to_a_closet line_height40 width388 druk_large rotation_gray padding_bottom25">Welcome to a closet without boundaries.</div>
            <div className="welcome_description line_height28 width388 proxima_xl rotation_gray padding_bottom25">Rent unlimited streetwear, for one low monthly price. Choose from our massive catalog and swap items whenever you want. We curate the latest in style and keep your closet in season so you don’t have to.</div>
            <div className="flex sign_up">
              <div className="sign_up_box white_background flex align_center"><input className="width200 spacing10 opacity7 proxima_small medium rotation_gray left20" placeholder="ENTER EMAIL ADDRESS" name="landing_email" value={this.state.landing_email} onChange={(e) => this.handleInputChange(e)} /></div>
              <Link
                to="/sign-up"
                className="i_want_in spacing10 proxima_small semibold white rotation_gray_background flex justify_center align_center cursor_pointer uppercase"
                onClick={(e) => this.addLeadEmail(e)}>
                  I Want In
              </Link>
            </div>
          </div>
        </header>
        <section className="three_steps padding_top70 padding_bottom100 flex justify_between sides13pct">
          <div className="step_box rotation_gray_border">
            <div className="flex justify_evenly align_center rotation_gray_background padding_top10 padding_bottom10">
              <div className="druk_large white">1.</div>
              <div className="step_title line_height22 druk_small white">Select Your Pieces</div>
            </div>
            <div className="step_description line_height20 proxima_medium rotation_gray top30 margin_auto">Browse our curated catalog from the world’s most coveted designers. New items are added every two weeks, ensuring you always have access to the freshest closet.</div>
          </div>
          <div className="step_box rotation_gray_border">
            <div className="flex justify_evenly align_center rotation_gray_background padding_top10 padding_bottom10">
              <div className="druk_large white">2.</div>
              <div className="step_title line_height22 druk_small white">Rotate Without Limits</div>
            </div>
            <div className="step_description line_height20 proxima_medium rotation_gray top30 margin_auto">Whether it's a special occasion or your next daily wear, The Rotation holds no limits above your head. Wear, purchase, or exchange amongst our catalog as much as you like.</div>
          </div>
          <div className="step_box rotation_gray_border">
            <div className="flex justify_evenly align_center rotation_gray_background padding_top10 padding_bottom10">
              <div className="druk_large white">3.</div>
              <div className="step_title line_height22 druk_small white">We Handle The Rest</div>
            </div>
            <div className="step_description line_height20 proxima_medium rotation_gray top30 margin_auto">When you're ready for something new, send your pieces back dirty using the provided pre-paid shipping label.</div>
          </div>
        </section>
        <section className="padding_bottom100 sides13pct">
          <h2 className="medium druk_medium rotation_gray padding_bottom35">What's In Store</h2>
          <div className="scrolling_wrapper">
            {this.state.items.map((item, index) => {
              return (
                <div key={index} className="padding_right30">
                  <div className="item_card light_background flex align_center justify_center">
                    <img className="blend_background max_width130" src={item.image_url} alt="" />
                  </div>
                  <div className="proxima_small semibold rotation_gray padding_top10 uppercase">{item.title}</div>
                  <div className="padding_top2 opacity7 proxima_small rotation_gray lowercase">{item.subtitle}</div>
                </div>
              )
            })}
          </div>
        </section>
        <PricingTable />
      </div>
    )
  }
}

export default LandingPage
