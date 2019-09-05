import React, { Component } from "react"
// import { Link } from "react-router-dom"

class NewLandingPage extends Component {
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
      <div className="NewLandingPage">
        <header>
          <img src={"../images/landing-bg.jpg"} className="background_image" alt="" />
          <div className="welcome_elements">
            <div className="welcome_to_a_closet padding_bottom25">
              Welcome to a closet without boundaries.
            </div>
            <div className="welcome_description padding_bottom25">
              This is The Rotation. A members-only club that gives you access to an extensive designer wardrobe, for a fraction of the price. Everything you could want, right at your fingertips.
            </div>
            <div className="sign_up_box flex align_center justify_center">
              <div className="sign_up">
                Sign Up
              </div>
            </div>
          </div>
        </header>
        
        <section className="padding_top70 padding_bottom100 flex justify_evenly">
          <div className="step_box">
            <div className="large_number inline_block top10 padding_sides40">1.</div>
            <div className="step_title inline_block">
              Select your pieces
            </div>
            <div className="step_description top30 margin_auto">
              Browse our curated catalog from the world’s most coveted designers. We'll deliver it straight to your door with a pre-paid return shipping label.
            </div>
          </div>
          <div className="step_box">
            <div className="large_number inline_block top10 padding_sides40">2.</div>
            <div className="step_title inline_block">
              Rotate without limits
            </div>
            <div className="step_description top30 margin_auto">
              Whether its a special ocassion or your next daily wear, The Rotation holds no limits above your head. Wear, purchase, or rotate amongst our catalog as you see fit.
            </div>
          </div>
          <div className="step_box">
            <div className="large_number inline_block top10 padding_sides40">3.</div>
            <div className="step_title_wide inline_block">
              We'll take care of the rest
            </div>
            <div className="step_description top30 margin_auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </div>
          </div>
        </section>
        
        <section className="padding_bottom100">
          <h2 className="padding_left50 padding_bottom35 section_header">What's In Store</h2>
          <div className="scrolling_wrapper">
            <div className="padding_left30"></div>
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
            <div className="padding_right30"></div>
          </div>
        </section>
        
        <section className="padding_bottom100">
          <h2 className="padding_left50 padding_bottom35 section_header">Featured Brands</h2>
          
        </section>
        
        <section className="padding_bottom100 text_center">
          <div className="plan_pricing padding_bottom15">PLAN + PRICING</div>
          <div className="subscribe_to_the_closet padding_bottom15">Subscribe to the closet of your future</div>
          <div className="padding_bottom15 flex justify_center align_center">
            <div className="pricing_rectangle">
              <div>2</div>
              <div>Pieces at a Time</div>
            </div>
            <div className="pricing_rectangle black_bg">
              <div>$49</div>
              <div>Per Month</div>
            </div>
          </div>
          <div>
            <div>
              <div>
                
              </div>
              <div>
                
              </div>
              <div>
                
              </div>
            </div>
              
          </div>
        </section>
      </div>
    )
  }

}

export default NewLandingPage