import React, { Component } from "react"
import RTUIFormInput from "../RTUIFormInput"
import RTUIFormSubmit from "../RTUIFormSubmit"

class LoginPane extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginEmail: "",
      loginPassword: ""
    }
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
      <div className="LoginPane width300 margin_auto">
        <div className="top20 druk_small rotation_gray">Log In</div>
        <form onSubmit={(e) => this.props.handleLoginSubmit(e, this.state.loginEmail, this.state.loginPassword)}>
          <RTUIFormInput title="Email address" name="loginEmail" value={this.props.loginEmail} onChange={(e) => this.handleInputChange(e)}/>
          <RTUIFormInput title="Password" name="loginPassword" value={this.props.loginPassword} onChange={(e) => this.handleInputChange(e)} type="password"/>
          <div className="proxima_xs medium rotation_gray top10 text_center underline cursor_pointer" onClick={(e) => this.props.forgotPassword(e, this.state.loginEmail)}>Forgot your password?</div>
          <RTUIFormSubmit title="Log In" />
        </form>
        <div className="proxima_small medium underline rotation_gray top10 bottom20 flex justify_center cursor_pointer" onClick={this.props.handleSignUpClicked}>Don't have an account? Sign up</div>
      </div>
    )
  }
}

export default LoginPane