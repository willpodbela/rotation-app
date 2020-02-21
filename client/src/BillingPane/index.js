import React, { Component } from "react"
import Auth from "../modules/Auth"
import "./style.css"
import RTUIFormInput from "../RTUIFormInput"
import RTUIButton from "../RTUIButton"

class BillingPane extends Component {
  constructor(props){
    super(props)
    this.state = {
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
    this.loadStripe()
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }
  
  tokenizePayment(e){
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
          this.props.onSuccessfulTokenization(response.id)
        }else{
          this.props.errorHandler(response.error)
        }
      })
    }
  }
  
  loadStripe(){
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        //window['Stripe'].setPublishableKey("pk_live_1Diz5oMjZzQlcZ2a4eLeHunm");
        window['Stripe'].setPublishableKey("pk_test_Nfvb3ZjRZMUfa9HxzXsz0PnZ");
      }
      window.document.body.appendChild(s);
    }
  }
  
  render(){
    return (
      <div className="BillingPane">
        <div className="non_mobile_billing_modal width620">
          <div className="account_title druk_xs medium rotation_gray">{this.props.headerText || "Update Credit Card"}</div>
          <div className="input_group flex justify_between width_full">
            <RTUIFormInput title="Name on Card" name="billingName" value={this.state.billingName} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="Address Line 1" name="billingAddressLine1" value={this.state.billingAddressLine1} onChange={(e) => this.handleInputChange(e)}/>
          </div>
          <div className="input_group flex justify_between width_full">
            <RTUIFormInput title="Card Number" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="Address Line 2" name="billingAddressLine2" value={this.state.billingAddressLine2} onChange={(e) => this.handleInputChange(e)}/>
          </div>
          <div className="input_group flex justify_between width_full">
            <RTUIFormInput title="Expiration" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} width="140" />
            <RTUIFormInput title="CVV" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} width="140" />
            <RTUIFormInput title="City" name="billingCity" value={this.state.billingCity} onChange={(e) => this.handleInputChange(e)} />
          </div>
          <div className="input_group flex justify_between width_full">
            <RTUIButton onClick={(e) => this.tokenizePayment(e)}>
              {this.props.callToActionTitle || "Update Payment Details"}
            </RTUIButton>
            <RTUIFormInput title="State" name="billingState" value={this.state.billingState} onChange={(e) => this.handleInputChange(e)} width="140" />
            <RTUIFormInput title="Zip" name="billingZipcode" value={this.state.billingZipcode} onChange={(e) => this.handleInputChange(e)} width="140" />
          </div>
        </div>
        <div className="mobile_billing_modal">
          <div className="account_title druk_xs medium rotation_gray">{this.props.headerText || "Update Credit Card"}</div>
          <div className="input_group flex justify_between width_full">
            <RTUIFormInput title="Name on Card" name="billingName" value={this.state.billingName} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="Card Number" name="creditCardNumber" value={this.state.creditCardNumber} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="Expiration" name="expiration" value={this.state.expiration} onChange={(e) => this.handleInputChange(e)} width="140" />
            <RTUIFormInput title="CVV" name="cvv" value={this.state.cvv} onChange={(e) => this.handleInputChange(e)} width="140" />
          </div>
          <div className="input_group flex justify_between width_full">
            <RTUIFormInput title="Address Line 1" name="billingAddressLine1" value={this.state.billingAddressLine1} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="Address Line 2" name="billingAddressLine2" value={this.state.billingAddressLine2} onChange={(e) => this.handleInputChange(e)}/>
            <RTUIFormInput title="City" name="billingCity" value={this.state.billingCity} onChange={(e) => this.handleInputChange(e)} />
            <RTUIFormInput title="State" name="billingState" value={this.state.billingState} onChange={(e) => this.handleInputChange(e)} width="140" />
            <RTUIFormInput title="Zip" name="billingZipcode" value={this.state.billingZipcode} onChange={(e) => this.handleInputChange(e)} width="140" />
          </div>
          <RTUIButton onClick={(e) => this.tokenizePayment(e)}>
              {this.props.callToActionTitle || "Update Payment Details"}
            </RTUIButton>
        </div>
      </div>
    )
  }

}

export default BillingPane
