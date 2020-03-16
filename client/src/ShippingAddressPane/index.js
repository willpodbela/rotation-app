import React, { Component } from "react"
import Auth from "../modules/Auth"
import "./style.css"
import RTUIFormInput from "../RTUIFormInput"
import RTUIButton from "../RTUIButton"

class AccountPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      zipcode: "",
      state: ""
    }
  }

  componentDidMount(){    
    if(this.props.auth){
      // Set state with profile or refetch if null
      const profile = this.props.userLoggedIn.profile
      if (profile) {
        this.setProfile(profile)
      } else {
        this.getAccountDetails()
      }
    }
  }

  setProfile(profile) {
    this.setState({
      firstName: profile.first_name,
      lastName: profile.last_name,
      addressLine1: profile.address_line_one,
      addressLine2: profile.address_line_two,
      city: profile.address_city,
      zipcode: profile.address_zip,
      state: profile.address_state
    })
  }
  
  getAccountDetails() {
    fetch(`/api/web/users/${this.props.userLoggedIn.id}/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(results => {
      this.setProfile(results.profile)
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
    }).then(res => this.props.apiResponseHandler(res, "Account Details Saved!")).then(res => {
      if(this.props.onSuccessfulUpdate) {
       this.props.onSuccessfulUpdate(e)
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
      <div className="ShippingAddressPane width620">
        <div className="account_title druk_xs medium rotation_gray">{this.props.headerText || "Shipping Address"}</div>
        <div className="input_group flex justify_between width_full">
          <RTUIFormInput title="First Name" name="firstName" value={this.state.firstName} onChange={(e) => this.handleInputChange(e)}/>
          <RTUIFormInput title="Last Name" name="lastName" value={this.state.lastName} onChange={(e) => this.handleInputChange(e)}/>
        </div>
        <div className="input_group flex justify_between width_full">
          <RTUIFormInput title="Address Line 1" name="addressLine1" value={this.state.addressLine1} onChange={(e) => this.handleInputChange(e)}/>
          <RTUIFormInput title="Address Line 2" name="addressLine2" value={this.state.addressLine2} onChange={(e) => this.handleInputChange(e)}/>
        </div>
        <div className="input_group flex justify_between width_full">
          <RTUIFormInput title="City" name="city" value={this.state.city} onChange={(e) => this.handleInputChange(e)}/>
          <RTUIFormInput title="Zip" name="zipcode" value={this.state.zipcode} onChange={(e) => this.handleInputChange(e)} width="140" />
          <RTUIFormInput title="State" name="state" value={this.state.state} onChange={(e) => this.handleInputChange(e)} width="140" />
        </div>
        <RTUIButton onClick={(e) => this.updateAccountDetails(e)}>
          {this.props.callToActionTitle || "Save Changes"}
        </RTUIButton>
      </div>
    )
  }

}

export default AccountPage
