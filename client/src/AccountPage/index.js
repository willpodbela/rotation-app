import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Auth from "../modules/Auth"
import "./style.css"
import ShippingAddressPane from "../ShippingAddressPane"

class AccountPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      showProfile: true,
      showBilling: false,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      billingName: "",
      creditCardNumber: "",
      expiration: "",
      cvv: "",
      billingAddressLine1: "",
      billingAddressLine2: "",
      billingCity: "",
      billingZipcode: "",
      billingState: "",
      error: null,
      subscription: false, //NOTE: Not exactly "convention", if you want to change, just function at line 90 and Ctrl+Find any references to 'subscription.'
      planOptions: [
        {itemQty: 2, monthlyCost: "$89", selected: false},
        {itemQty: 3, monthlyCost: "$129", selected: false},
        {itemQty: 4, monthlyCost: "$159", selected: false},
      ]
    }
  }

  componentDidMount(){
    window.analytics.page("Account"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
    
    if(this.props.auth){
      this.loadStripe()
      // Set state with subscription if present
      const subscription = this.props.userLoggedIn.subscription
      this.setSubscription(subscription)
    }
  }

  setSubscription(subscription) {
    this.setState({
      subscription: (subscription || false)
    })
    if (subscription) {
      this.setSelectedPlan(subscription.item_qty)
    }
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  toggleBillingPage(e){
    this.setState({showProfile: false, showBilling: true})
  }

  toggleProfilePage(e){
    this.setState({showProfile: true, showBilling: false})
  }

  attemptPayment(e){
    e.preventDefault()
    if (this.state.creditCardNumber === ""
    || this.state.cvv === ""
    || this.state.billingName === ""
    || this.state.expiration === "") {
      this.props.errorHandler({message: "Please fill out all credit card fields."})
    } else if(this.state.billingAddressLine1 === ""
    || this.state.billingCity === ""
    || this.state.billingState === ""
    || this.state.billingZipcode === "") {
      this.props.errorHandler({message: "Please enter a valid billing address."})
    } else if (this.state.expiration.split("/").length !== 2) {
      this.props.errorHandler({message: "Please enter expiration date in the form of MM/YY."})
    } else {
      const expMonth = this.state.expiration.split("/")[0].replace(/ /g,'')
      const expYear = this.state.expiration.split("/")[1].replace(/ /g,'')
      window.Stripe.card.createToken({
        number: this.state.creditCardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: this.state.cvv.replace(/ /g,''),
        name: this.state.billingName,
        address_line1: this.state.billingAddressLine1,
        address_line2: this.state.billingAddressLine2,
        address_city: this.state.billingCity,
        address_state: this.state.billingState,
        address_zip: this.state.billingZipcode,
        address_country: "US"
      }, (status, response) => {
        if(status === 200){
          this.updatePayment(response.id)
        }else{
          this.props.errorHandler(response.error)
        }
      })
    }
  }

  // -- Subscription API Calls

  updatePayment(stripeID){
    fetch("/api/web/subscription/update-payment", {
      method: "POST",
      body: JSON.stringify({
        stripe_source_id: stripeID
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, "Payment Method Updated!"))
  }

  createSubscription(stripeID, itemQuantity){
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
    }).then(res => this.props.apiResponseHandler(res, "Subscription Created!"))
  }

  cancelSubscription(){
    this.updateSubscription({ cancel_at_period_end: true })
  }

  restoreSubscription(){
    this.updateSubscription({ cancel_at_period_end: false })
  }

  updateSubscriptionTier(e) {
    const plan = this.state.planOptions.find(plan => plan.selected)
    if (plan) {
      const itemQuantity = this.state.planOptions.find(plan => plan.selected).itemQty
      this.updateSubscription({ item_qty: itemQuantity }, "Plan updated! Billing will be prorated for the remainder of the month.")
    } else {
      this.props.errorHandler({message: "Please select a plan."})
    }
  }

  updateSubscription(params, message = null) {
    fetch("/api/web/subscription", {
      method: "PUT",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, message)).then(res => {
      this.setSubscription(res.subscription)
    })
  }

  // -- View Helpers

  togglePlanOptions(e){
    this.setSelectedPlan(parseInt(e.target.getAttribute("name")))
  }

  setSelectedPlan(itemQty){
    let plansOptionsCopy = [...this.state.planOptions]
    plansOptionsCopy.forEach((plan, index) => {
      plansOptionsCopy[index].selected = (plan.itemQty === itemQty)
    })
    this.setState({plansOptions: plansOptionsCopy})
  }

  // -- Stripe API Setup

  loadStripe(){
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window['Stripe'].setPublishableKey("pk_live_1Diz5oMjZzQlcZ2a4eLeHunm");
      }
      window.document.body.appendChild(s);
    }
  }

  // -- Render

  render(){
    let endDate = false
    if (this.state.subscription) {
      endDate = new Date(this.state.subscription.current_period_end)
    }
    if(!this.props.auth){
      return <Redirect to="/catalog" />
    }
    return (
      <div className="AccountPage gray_border_top bottom70">
        <div className="flex justify_between sides13pct">
          <div className="top40 right30 proxima_small rotation_gray semibold spacing20 uppercase">
            <div className="cursor_pointer" style={{textDecoration: this.state.showProfile ? "underline" : "none"}} onClick={(e) => this.toggleProfilePage(e)}>Profile</div>
            <div className="top20 cursor_pointer" style={{textDecoration: this.state.showBilling ? "underline" : "none"}} onClick={(e) => this.toggleBillingPage(e)}>Billing</div>
          </div>
          {this.state.showProfile &&
            <div className="width646 top40 padding_bottom20">
              <ShippingAddressPane auth={this.props.auth} userLoggedIn={this.props.userLoggedIn} apiResponseHandler={this.props.apiResponseHandler} />
              
              <div className="profile_divider rotation_gray_background top60"></div>
              <div className="druk_xs medium rotation_gray top60">Manage Plan</div>
              {this.state.subscription ? (
                this.state.subscription.status === "active" ? (
                  <div>
                    <div className="flex">
                      {this.state.planOptions.map((plan, index) => {
                        return (
                          <div
                            key={index}
                            className="input_box_account right20 rotation_gray_border rotation_gray_background width150 height100 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer text_center"
                            style={{background: plan.selected ? "#333333" : "#FFFFFF", color: plan.selected ? "#FFFFFF" : "#333333"}}
                            name={plan.itemQty}
                            onClick={(e) => this.togglePlanOptions(e)}
                          >
                            {plan.itemQty} Items
                            <br />
                            {plan.monthlyCost}/Month
                          </div>
                        )
                      })}
                    </div>
                    <div className="input_box_account rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updateSubscriptionTier(e)}>Change Plan</div>
                    <div className="cancel_subscription top20 padding_bottom85 proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer" onClick={(e) => this.cancelSubscription(e)}>Cancel Subscription</div>
                  </div>
                ) : this.state.subscription.status === "canceled" ? (
                  <div>
                    <span className="top20 padding_bottom85 proxima_small rotation_gray semibold spacing20">Your subscription ends {endDate ? ("on "+endDate.toDateString()) : ("soon")}. Be sure to send your clothes back by then!</span>
                    <div className="cancel_subscription top20 padding_bottom85 proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer" onClick={(e) => this.restoreSubscription(e)}>Resume Subscription: {this.state.subscription.item_qty} Item Plan</div>
                  </div>
                ) : null
              ) : (
                <span className="top20 padding_bottom85 proxima_small rotation_gray semibold spacing20">You don't currently have an active subscription. Choose your first piece in the Catalog and click "Reserve" to shop our plans.</span>
              )}
            </div>
          }
          {this.state.showBilling &&
            <div className="width630 top40 padding_bottom60">
              <form onSubmit={(e) => this.attemptPayment(e)}>
                <div className="account_title druk_xs medium rotation_gray">Update Credit Card</div>
                <div className="input_box_account gray_border width300 height50 top20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Name on Card</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingName" value={this.state.billingName} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_box_account gray_border width300 height50 top20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Credit Card Number</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_group flex">
                  <div className="input_box_account gray_border width300 height50 top20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">Expiration</div>
                    <input className="input_field proxima_xl medium rotation_gray width260 left20" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                  <div className="input_box_account gray_border width300 height50 top20 left20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">CVV</div>
                    <input className="input_field proxima_xl medium rotation_gray width260 left20" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                </div>
                <div className="account_title druk_xs medium rotation_gray top60">Billing Address</div>
                <div className="input_group flex">
                  <div className="input_box_account gray_border width300 height50 top20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 1</div>
                    <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingAddressLine1" value={this.state.billingAddressLine1} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                  <div className="input_box_account gray_border width300 height50 top20 left20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 2</div>
                    <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingAddressLine2" value={this.state.billingAddressLine2} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                </div>
                <div className="input_group flex">
                  <div className="input_box_account gray_border width300 height50 top20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">City</div>
                    <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingCity" value={this.state.billingCity} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                  <div className="input_box_account gray_border width100 height50 top20 left20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">Zip</div>
                    <input className="input_field proxima_xl medium rotation_gray width60 left20" name="billingZipcode" value={this.state.billingZipcode} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                  <div className="input_box_account gray_border width100 height50 top20 left20">
                    <div className="proxima_small medium very_light_gray left20 top5 height15">State</div>
                    <input className="input_field proxima_xl medium rotation_gray width60 left20" name="billingState" value={this.state.billingState} onChange={(e) => this.handleInputChange(e)} />
                  </div>
                </div>
                <input type="submit" value="Save Changes" className="input_box_account rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer"></input>
              </form>
            </div>
          }
        </div>
      </div>
    )
  }

}

export default AccountPage
