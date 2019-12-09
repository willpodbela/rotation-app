import React, { Component } from "react"
import { Link } from "react-router-dom"
import Auth from "../modules/Auth"
import "./style.css"

class AccountPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      showProfile: true,
      showSettings: false,
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipcode: "",
      state: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      firstName: "",
      lastName: "",
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
    //Need to get id of logged in user somehow
    fetch("/users/2/profile", {
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
    //Need to get id of logged in user somehow
    fetch("/users/2/profile", {
      method: "PUT",
      body: JSON.stringify({
        "profile": {
      		"address_line_one": this.state.addressLine1,
          "address_line_two": this.state.addressLine2,
          "address_city": this.state.city,
          "address_zip": this.state.zipcode,
          "address_state": this.state.state
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

  updatePassword(e){
    console.log("here")
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

  toggleSettingsPage(e){
    this.setState({showProfile: false, showSettings: true})
  }

  toggleProfilePage(e){
    this.setState({showProfile: true, showSettings: false})
  }

  render(){
    return (
      <div className="AccountPage gray_border_top bottom70 flex">
        <div className="left13pct top40 proxima_small rotation_gray semibold spacing20 uppercase">
          <div className="cursor_pointer" style={{textDecoration: this.state.showProfile ? "underline" : "none"}} onClick={(e) => this.toggleProfilePage(e)}>Profile</div>
          <div className="top20 cursor_pointer">Credits</div>
          <div className="top20"><Link to="/prelauncher">Refer & Earn</Link></div>
          <div className="top20 cursor_pointer" style={{textDecoration: this.state.showSettings ? "underline" : "none"}} onClick={(e) => this.toggleSettingsPage(e)}>Settings</div>
        </div>
        {this.state.showProfile &&
          <div className="account_inputs top40 sides100">
            <div className="druk_xs medium rotation_gray">Account Details</div>
            <div className="input_box gray_border width300 height50 top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Email address</div>
              <input className="proxima_xl medium rotation_gray width260 left20" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_box gray_border width300 height50 top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Subscription Plan</div>
              <input className="proxima_xl medium rotation_gray width260 left20" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} />
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
            <div className="profile_divider rotation_gray_background top40"></div>
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
            <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.updatePassword(e)}>Save Changes</div>
            <div className="profile_divider rotation_gray_background top40"></div>
            <div className="druk_xs medium rotation_gray top20">Need a break?</div>
            <div className="flex top30 input_group">
              <div className="proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer">Pause Subscription</div>
              <div className="cancel_subscription proxima_small rotation_gray semibold spacing20 uppercase underline cursor_pointer left50">Cancel Subscription</div>
            </div>
          </div>
        }
        {this.state.showSettings &&
          <div className="account_inputs top40 sides100">
            <div className="druk_xs medium rotation_gray">Credit Card</div>
            <div className="input_group flex">
              <div className="input_box flex align_center gray_border width300 height50 top20">
                <input className="proxima_xl medium width260 left20" placeholder="First Name" name="firstName" value={this.state.firstName} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box flex align_center gray_border width300 height50 top20 left20">
                <input className="proxima_xl medium width260 left20" placeholder="Last Name" name="lastName" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)} />
              </div>
            </div>
            <div className="input_box flex align_center gray_border width300 height50 top20">
              <input className="proxima_xl medium width260 left20" placeholder="Credit Card Number" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_group flex">
              <div className="input_box flex align_center gray_border width300 height50 top20">
                <input className="proxima_xl medium width260 left20" placeholder="MM / YY" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} />
              </div>
              <div className="input_box flex align_center gray_border width300 height50 top20 left20">
                <input className="proxima_xl medium width260 left20" placeholder="CVV" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} />
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
