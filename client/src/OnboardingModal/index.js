import React, { Component } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./style.css"
import Modal from "react-bootstrap/Modal"
import Auth from "../modules/Auth"
import ShippingAddressPane from "../ShippingAddressPane"
import BillingPane from "../BillingPane"
import LoginPane from "../LoginPane"
import SignUpPane from "../SignUpPane"
import PromoCodePane from "../PromoCodePane"

class OnboardingModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentModal: false,
      showPromoCode: false,
      planOptions: [
        {itemQty: 2, monthlyCost: "$89", selected: false},
        {itemQty: 3, monthlyCost: "$129", selected: false},
        {itemQty: 4, monthlyCost: "$159", selected: false},
      ],
      stripeID: "",
      promptSignUpFirst: (!!sessionStorage.advertisementCode || props.promptSignUpFirst)
    }
  }
  
  componentDidMount(){  
    if(this.props.auth){
      this.showModal("plans")
    }else{
      this.showModal(this.state.promptSignUpFirst ? "signup" : "login")
    }
  }
  
  showModal(name) {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    window.analytics.page(capitalized.concat(" Modal")); // Name of this page view for analytics purposes
    
    this.setState({ currentModal: name })
  }
  
  togglePlanOptions(e){
    let plansOptionsCopy = [...this.state.planOptions]
    plansOptionsCopy.forEach((plan, index) => {
      plansOptionsCopy[index].selected = (plan.itemQty === parseInt(e.target.getAttribute("name")))
    })
    this.setState({plansOptions: plansOptionsCopy})
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }
  
  successfulBillingTokenization(token) {
    this.setState({stripeID: token})
    this.showModal("shipping")
  }

  checkPlanSelected(e){
    if(this.state.planOptions.map(plan => plan.selected).includes(true)){
      this.showModal("billing")
      window.analytics.track('Plan Selected')
    }else{
      this.props.errorHandler({message: "Please select a plan."})
    }
  }
  
  showPromoCodePane(e){
    this.setState({showPromoCode: true})
  }

  createSubscription(e, stripeID, itemQuantity){
    fetch("/api/web/subscription", {
      method: "POST",
      body: JSON.stringify({
        stripe_source_id: stripeID,
        item_qty: itemQuantity
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, "Welcome to the Rotation! You're going to like it here. Pick your first item below.")).then(res => {
      window.analytics.track('Subscription Started', {
        item_qty: itemQuantity,
        value: this.selectedPlanMonthlyCostInt(),
        currency: "usd"
      })
      window.analytics.track('Order Completed', {
        item_qty: itemQuantity,
        value: this.selectedPlanMonthlyCostInt(),
        currency: "usd"
      })
      ;
      
      window.location.reload(true)
    })
  }
  
  selectedPlanMonthlyCostInt() {
    return this.monthlyCostStringToInt(this.state.planOptions.find(plan => plan.selected).monthlyCost)
  }
  
  monthlyCostStringToInt(string) {
    return parseInt(string.replace('$', ''))
  }
  
  subtotal(standard_cost = this.selectedPlanMonthlyCostInt()) {
    let subtotal = standard_cost
    let c = this.props.userLoggedIn.coupon
    if (c) {
      if(c.amount_off) {
        subtotal = subtotal-(c.amount_off/100.0)
      } else if (c.percent_off) {
        subtotal = (subtotal*(1-(c.percent_off/100.0)))
      }
    }
    let cred = this.props.userLoggedIn.account_balance
    if (cred) {
      subtotal = subtotal-((cred * -1)/100)
    }
    if (subtotal < 0) {
      subtotal = 0
    }
    return subtotal
  }
  
  render(){
    const planSelected = this.state.planOptions.find(plan => plan.selected)
    return (
      <Modal show={this.props.show || true} dialogClassName="modal_item" centered>
        <div className="modal_section height500 width_full white_background">
          <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={this.props.onClose} icon="times" />
          <div className="top50 flex justify_center" style={{clear: "right"}}>
            {this.state.currentModal === "confirm" &&
              <div>
                <div className="druk_xs medium rotation_gray">Checkout</div>
                <div className="proxima_large semibold rotation_gray top30">The Rotation</div>
                <div className="proxima_large rotation_gray opacity6">{planSelected.itemQty} Items at a Time - {this.subtotal()!==this.selectedPlanMonthlyCostInt() && "$"+this.subtotal()+" today, "}{planSelected.monthlyCost}/month {this.subtotal()!==this.selectedPlanMonthlyCostInt() && "after that"}</div>
                <div className="confirm_modal_box width400 height100 rotation_gray_border top20">
                  <div className="proxima_small rotation_gray"><FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" />You'll be charged ${this.subtotal()} now for your first month</div>
                  <div className="proxima_small rotation_gray"><FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" />You'll be charged {planSelected.monthlyCost} for each month after that</div>
                  <div className="proxima_small rotation_gray"><FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" />Cancel at any time before your next cycle</div>
                  <div className="non_mobile_overflow proxima_small rotation_gray"><FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" />By purchasing you agree to the full membership <Link to="/terms">terms & conditions</Link></div>
                  <div className="mobile_overflow hidden proxima_small rotation_gray"><FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" /><div className="width260">By purchasing you agree to the full membership <Link to="/terms">terms & conditions</Link></div></div>
                </div>
                <div className="confirm_modal rotation_gray_border rotation_gray_background width400 height50 top30 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.createSubscription(e, this.state.stripeID, planSelected.itemQty)} >
                  Purchase
                </div>
              </div>
            }
            {this.state.currentModal === "shipping" &&
              <ShippingAddressPane
                auth={this.props.auth}
                userLoggedIn={this.props.userLoggedIn}
                apiResponseHandler={this.props.apiResponseHandler}
                onSuccessfulUpdate={(e) => this.showModal("confirm")}
                headerText="Add Shipping Address"
                callToActionTitle={
                  ["Next Step",<FontAwesomeIcon className="white font12 left20" icon="chevron-right" />]
                }
              />
            }
            {this.state.currentModal === "billing" &&
              <div>
                <BillingPane
                  auth={this.props.auth}
                  userLoggedIn={this.props.userLoggedIn}
                  apiResponseHandler={this.props.apiResponseHandler}
                  onSuccessfulTokenization={(token) => this.successfulBillingTokenization(token)}
                  errorHandler={(error) => this.props.errorHandler(error)}
                  headerText="Add Billing Info"
                  callToActionTitle={
                    ["Next Step",<FontAwesomeIcon className="white font12 left20" icon="chevron-right" />]
                  }
                />
                {this.state.showPromoCode ? (
                  <PromoCodePane
                    auth={this.props.auth}
                    userLoggedIn={this.props.userLoggedIn}
                    apiResponseHandler={this.props.apiResponseHandler}
                  />
                ) : (
                  <div className="proxima_small medium underline rotation_gray top10 bottom20 flex justify_start cursor_pointer" onClick={(e) => this.showPromoCodePane(e)}>Have a promo or referral code?</div>
                )}
              </div>
            }
            {this.state.currentModal === "plans" &&
              <div className="width500">
                <div className="top20 druk_small rotation_gray">Choose Your Plan</div>
                <div className="top20 proxima_small rotation_gray">Three different ways to elevate your style.</div>
                <div className="plan_btns flex justify_between">
                  {this.state.planOptions.map((plan, index) => {
                    return (
                      <div
                        key={index}
                        className="input_box rotation_gray_border rotation_gray_background width150 height100 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer text_center stop_child_clicks"
                        style={{background: plan.selected ? "#333333" : "#FFFFFF", color: plan.selected ? "#FFFFFF" : "#333333"}}
                        name={plan.itemQty}
                        onClick={(e) => this.togglePlanOptions(e)}
                      >
                        <div>
                          <span>{plan.itemQty} Items</span>
                          <br />
                          <span style={{ textDecoration: this.monthlyCostStringToInt(plan.monthlyCost) !== this.subtotal(this.monthlyCostStringToInt(plan.monthlyCost)) ? 'line-through' : 'none' }}>{plan.monthlyCost}/Month</span>
                          <br />
                          {this.monthlyCostStringToInt(plan.monthlyCost) !== this.subtotal(this.monthlyCostStringToInt(plan.monthlyCost)) &&
                            <span>${this.subtotal(this.monthlyCostStringToInt(plan.monthlyCost))}/Month</span>
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div
                  className="add_credit_card rotation_gray_border rotation_gray_background width300 height50 top40 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer"
                  onClick={(e) => this.checkPlanSelected(e)}
                >
                  Add Credit Card<FontAwesomeIcon className="white font12 left20" icon="chevron-right" />
                </div>
              </div>
            }
            {this.state.currentModal === "login" &&
              <LoginPane
                handleLoginSubmit={this.props.handleLoginSubmit}
                forgotPassword={this.props.forgotPassword}
                handleSignUpClicked={(e) => this.showModal("signup")}
              />
            }
            {this.state.currentModal === "signup" &&
              <SignUpPane
                handleSignUp={this.props.handleSignUp}
                handleLogInClicked={(e) => this.showModal("login")}
              />
            }
          </div>
        </div>
      </Modal>
    )
  }
}

export default OnboardingModal
