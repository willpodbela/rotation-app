import React, { Component } from "react"
import Auth from "../modules/Auth"
import "./style.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import RTUIFormInput from "../RTUIFormInput"
import RTUIButton from "../RTUIButton"

class PromoCodePane extends Component {
  constructor(props){
    super(props)
    this.state = {
      referralCode: "",
      codeSuccess: false
    }
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }
  
  applyPromoCode(e){    
    fetch(`/api/web/users/${this.props.userLoggedIn.id}`, {
      method: "PUT",
      body: JSON.stringify({
          referral_code: this.state.referralCode
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, "Code Successfully Applied! Prices will reflect at end of checkout.")).then(res => {
      this.setState({codeSuccess: true})
    })
  }
  
  render(){
    return (
      <div className="PromoCodePane width300">
        <div className="input_group flex justify_between width_full">
          <RTUIFormInput title="Code" name="referralCode" value={this.state.referralCode} onChange={(e) => this.handleInputChange(e)} width="140" />
          <RTUIButton onClick={(e) => this.applyPromoCode(e)} width="140" >
            Apply{this.state.codeSuccess && <FontAwesomeIcon icon="check-circle" color="#3c763d" />}
          </RTUIButton>
        </div>
      </div>
    )
  }

}

export default PromoCodePane
