import React, { Component } from "react"
// import { Link } from "react-router-dom"
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
    let username = process.env.REACT_APP_API_AUTH_NAME;
    let password = process.env.REACT_APP_API_AUTH_PASSWORD;
        
    fetch("/api/v1/items/list", {
      headers: {
        "Authorization": `Basic ${Buffer.from(username + ":" + password).toString('base64')}`
      }
    })
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
        <header className="background flex">
          <div className="left13pct">
            <div className="welcome_to_a_closet padding_bottom25">Welcome to a closet without boundaries.</div>
            <div className="welcome_description padding_bottom25">Rent unlimited streetwear, for one low monthly price. Choose from our massive catalog and swap items whenever you want. We curate the latest in style and keep your closet in season so you don’t have to.</div>
            <div className="flex sign_up">
              <div className="sign_up_box flex justify_center align_center"><input className="email_input" placeholder="mason@ramsey.com"></input></div>
              <div className="i_want_in flex justify_center align_center">I WANT IN</div>
            </div>
          </div>
        </header>
        
        <section className="three_steps padding_top70 padding_bottom100 flex justify_between sides13pct">
          <div className="step_box">
            <div className="flex justify_evenly align_center top10">
              <div className="large_number inline_block">1.</div>
              <div className="step_title inline_block">Select your pieces</div>
            </div>
            <div className="step_description top30 margin_auto">Browse our curated catalog from the world’s most coveted designers. New items are added every two weeks, ensuring you always have access to the freshest closet.</div>
          </div>
          <div className="step_box only_border_sides">
            <div className="flex justify_evenly align_center top10">
              <div className="large_number inline_block">2.</div>
              <div className="step_title inline_block">Rotate without limits</div>
            </div>
            <div className="step_description top30 margin_auto">Whether it's a special occasion or your next daily wear, The Rotation holds no limits above your head. Wear, purchase, or exchange amongst our catalog as much as you like.</div>
          </div>
          <div className="step_box">
            <div className="flex justify_evenly align_center top10">
              <div className="large_number inline_block">3.</div>
              <div className="step_title title_wide inline_block">We'll take care of the rest</div>
            </div>
            <div className="step_description top30 margin_auto">When you're ready for something new, send your pieces back dirty using the provided pre-paid shipping label.</div>
          </div>
        </section>
        
        <section className="padding_bottom100 left13pct">
          <h2 className="padding_bottom35 section_header">What's In Store</h2>
          <div className="scrolling_wrapper">
            {this.state.items.map((item, index) => {
              return (
                <div key={index} className="card max_width150 padding_right40">
                  <div className="item_card flex align_center justify_center">
                    <img className="item_image" src={item.image_url} alt="" />
                  </div>
                  <div className="brand padding_top10">{item.title.toUpperCase()}</div>
                  <div className="description padding_top5">{item.description.toLowerCase()}</div>
                </div>
              )
            })}
          </div>
        </section>
        
        <section className="padding_bottom100 text_center">
          <div className="plan_pricing padding_bottom15">PLAN + PRICING</div>
          <div className="subscribe_to_the_closet padding_bottom15 margin_auto">Subscribe to the closet of your future</div>
          <div className="padding_bottom30 flex justify_center">
            <div className="pricing_rectangle flex align_center justify_center">
              <div>
                <div className="subscribe_to_the_closet">2</div>
                <div className="pricing_box_description">PIECES AT A TIME</div>
              </div>
            </div>
            <div className="pricing_rectangle flex align_center justify_center dark_bg">
              <div>
                <div className="subscribe_to_the_closet white_text">$49</div>
                <div className="pricing_box_description white_text">PER MONTH</div>
              </div>
            </div>
          </div>
          <div className="padding_bottom20">
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">Founder pricing for first 100 members only.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">We handle the dry-cleaning.</div>
              </div>
            </div>
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">Swap individual pieces anytime.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">New drops every 2 weeks.</div>
              </div>
            </div>
            <div className="padding_bottom10 height50 flex justify_center pricing_row">
              <div className="height40 padding_right20 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">Choose pieces from the world’s top men’s designer brands.</div>
              </div>
              <div className="height40 flex align_center justify_center pricing_col">
                <div className="icon_wrapper padding_right10"><FontAwesomeIcon className="checkbox_icon flex justify_center" icon="check-square" /></div>
                <div className="checkbox_description">Keep pieces for as long or as little as you want.</div>
              </div>
            </div>
          </div>
          <div className="join_waitlist_btn margin_auto flex">
            <div className="join_waitlist flex align_center margin_auto">JOIN WAITLIST</div>
          </div>
        </section>
      </div>
    )
  }
}

export default LandingPage