import React, { Component } from "react"
import Auth from "../modules/Auth"
import "./style.css"
import ErrorMessage from "../ErrorMessage"

class AccountPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      showProfile: true,
      showBilling: false,
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipcode: "",
      state: "",
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
      showError: false
    }
  }

  componentDidMount(){
    this.loadStripe()
    fetch(`/api/web/users/${this.props.userLoggedIn.id}/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    .then(results => {
      results.json()
        .then(results => {
          const profile = results.profile
          this.setState({
            firstName: profile.first_name,
            lastName: profile.last_name,
            addressLine1: profile.address_line_one,
            addressLine2: profile.address_line_two,
            city: profile.address_city,
            zipcode: profile.address_zip,
            state: profile.address_state
          })
        })
      })
  }

  updateAccountDetails(e){
    fetch(`/api/web/users/${this.props.userLoggedIn.id}/profile`, {
      method: "PUT",
      body: JSON.stringify({
        profile: {
          first_name: this.state.firstName,
          last_name: this.state.lastName,
      		address_line_one: this.state.addressLine1,
          address_line_two: this.state.addressLine2,
          address_city: this.state.city,
          address_zip: this.state.zipcode,
          address_state: this.state.state
        }
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => res.json()).then(res => {
      console.log(res)
      //handle errors here
    })
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
        this.setState({showError: true, errorMessage: response.error.message})
      }
    })
  }

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
    }).then(res => res.json()).then(res => {
      console.log(res)
      //handle errors here
    })
  }

  createSubscription(stripeID){
    const itemQuantity = 2
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
    }).then(res => res.json()).then(res => {
      console.log(res)
      //handle errors here
    })
  }

  loadStripe(){
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window['Stripe'].setPublishableKey(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      }
      window.document.body.appendChild(s);
    }
  }

  render(){
    return (
      <div className="AccountPage gray_border_top bottom70 flex">
        {this.state.showError &&
          <ErrorMessage error={{message: this.state.errorMessage}}/>
        }
        <div className="left13pct top40 proxima_small rotation_gray semibold spacing20 uppercase">
          <div className="cursor_pointer" style={{textDecoration: this.state.showProfile ? "underline" : "none"}} onClick={(e) => this.toggleProfilePage(e)}>Profile</div>
          <div className="top20 cursor_pointer" style={{textDecoration: this.state.showBilling ? "underline" : "none"}} onClick={(e) => this.toggleBillingPage(e)}>Billing</div>
        </div>
        {this.state.showProfile &&
          <div className="account_inputs top40 sides100 padding_bottom20">
            <div className="druk_xs medium rotation_gray">Shipping Address</div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">First Name</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="firstName" value={this.state.firstName} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Last Name</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="lastName" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 1</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="addressLine1" value={this.state.addressLine1} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 2</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="addressLine2" value={this.state.addressLine2} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">City</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="city" value={this.state.city} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Zip</div>
                <input className="input_field proxima_xl medium rotation_gray width60 left20" name="zipcode" value={this.state.zipcode} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">State</div>
                <input className="input_field proxima_xl medium rotation_gray width60 left20" name="state" value={this.state.state} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updateAccountDetails(e)}>Save Changes</div>
            <div className="profile_divider rotation_gray_background top60"></div>
            <div className="druk_xs medium rotation_gray top60">Need a break?</div>
            <div className="cancel_subscription top20 padding_bottom85 proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer">Cancel Subscription</div>
          </div>
        }
        {this.state.showBilling &&
          <div className="account_inputs top40 sides100 padding_bottom60">
            <form onSubmit={(e) => this.attemptPayment(e)}>
              <div className="druk_xs medium rotation_gray">Update Credit Card</div>
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Name on Card</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingName" value={this.state.billingName} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Credit Card Number</div>
                <input className="input_field proxima_xl medium rotation_gray width260 left20" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_group flex">
                <div className="input_box gray_border width300 height50 top20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Expiration</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_box gray_border width300 height50 top20 left20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">CVV</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} />
                </div>
              </div>
              <div className="druk_xs medium rotation_gray top60">Billing Address</div>
              <div className="input_group flex">
                <div className="input_box gray_border width300 height50 top20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 1</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingAddressLine1" value={this.state.billingAddressLine1} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_box gray_border width300 height50 top20 left20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 2</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingAddressLine2" value={this.state.billingAddressLine2} onChange={(e) => this.handleInputChange(e)} />
                </div>
              </div>
              <div className="input_group flex">
                <div className="input_box gray_border width300 height50 top20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">City</div>
                  <input className="input_field proxima_xl medium rotation_gray width260 left20" name="billingCity" value={this.state.billingCity} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_box gray_border width100 height50 top20 left20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">Zip</div>
                  <input className="input_field proxima_xl medium rotation_gray width60 left20" name="billingZipcode" value={this.state.billingZipcode} onChange={(e) => this.handleInputChange(e)} />
                </div>
                <div className="input_box gray_border width100 height50 top20 left20">
                  <div className="proxima_small medium very_light_gray left20 top5 height15">State</div>
                  <input className="input_field proxima_xl medium rotation_gray width60 left20" name="billingState" value={this.state.billingState} onChange={(e) => this.handleInputChange(e)} />
                </div>
              </div>
              <input type="submit" value="Save Changes" className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer"></input>
            </form>
          </div>
        }
      </div>
    )
  }

}

export default AccountPage
