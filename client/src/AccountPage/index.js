import React, { Component } from "react"
import Auth from "../modules/Auth"
import "./style.css"

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
      billingState: ""
    }
  }

  componentDidMount(){
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

  updateBillingInfo(e){
    console.log("here")
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

  render(){
    return (
      <div className="AccountPage gray_border_top bottom70 flex">
        <div className="left13pct top40 proxima_small rotation_gray semibold spacing20 uppercase">
          <div className="cursor_pointer" style={{textDecoration: this.state.showProfile ? "underline" : "none"}} onClick={(e) => this.toggleProfilePage(e)}>Profile</div>
          <div className="top20 cursor_pointer" style={{textDecoration: this.state.showBilling ? "underline" : "none"}} onClick={(e) => this.toggleBillingPage(e)}>Billing</div>
        </div>
        {this.state.showProfile &&
          <div className="account_inputs top40 sides100">
            <div className="druk_xs medium rotation_gray">Account Details</div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">First Name</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="firstName" value={this.state.firstName} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Last Name</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="lastName" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 1</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="addressLine1" value={this.state.addressLine1} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 2</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="addressLine2" value={this.state.addressLine2} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">City</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="city" value={this.state.city} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Zip</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="zipcode" value={this.state.zipcode} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">State</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="state" value={this.state.state} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updateAccountDetails(e)}>Save Changes</div>
            {/* <div className="profile_divider rotation_gray_background top40"></div>
            <div className="druk_xs medium rotation_gray top30">Password</div>
            <div className="input_box flex align_center gray_border width300 height50 top20">
              <input className="proxima_xl medium width260 left20" placeholder="Current Password" name="currentPassword" value={this.state.currentPassword} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_group flex">
              <div className="input_box flex align_center gray_border width300 height50 top20">
                <input className="proxima_xl medium width260 left20" placeholder="New Password" name="newPassword" value={this.state.newPassword} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box flex align_center gray_border width300 height50 top20 left20">
                <input className="proxima_xl medium width260 left20" placeholder="Confirm Password" name="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updatePassword(e)}>Save Changes</div> */}
            <div className="profile_divider rotation_gray_background top105"></div>
            <div className="druk_xs medium rotation_gray top105">Need a break?</div>
            <div className="flex top30 input_group">
              <div className="proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer">Pause Subscription</div>
              <div className="cancel_subscription proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer left50">Cancel Subscription</div>
            </div>
          </div>
        }
        {this.state.showBilling &&
          <div className="account_inputs top40 sides100">
            <div className="druk_xs medium rotation_gray">Credit Card</div>
            <div className="input_box gray_border width300 height50 top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Name on Card</div>
              <input className="proxima_xl medium rotation_gray width260 left20" name="billingName" value={this.state.billingName} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_box gray_border width300 height50 top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Credit Card Number</div>
              <input className="proxima_xl medium rotation_gray width260 left20" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Expiration</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">CVV</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="profile_divider rotation_gray_background top60"></div>
            <div className="druk_xs medium rotation_gray top60">Billing Address</div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 1</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="billingAddressLine1" value={this.state.billingAddressLine1} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width300 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Address Line 2</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="billingAddressLine2" value={this.state.billingAddressLine2} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_group flex">
              <div className="input_box gray_border width300 height50 top20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">City</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="billingCity" value={this.state.billingCity} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">Zip</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="billingZipcode" value={this.state.billingZipcode} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box gray_border width100 height50 top20 left20">
                <div className="proxima_small medium very_light_gray left20 top5 height15">State</div>
                <input className="proxima_xl medium rotation_gray width260 left20" name="billingState" value={this.state.billingState} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updateBillingInfo(e)}>Save Changes</div>
          </div>
        }
      </div>
    )
  }

}

export default AccountPage
