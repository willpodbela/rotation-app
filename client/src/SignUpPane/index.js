import React, { Component } from "react"
import { Link } from "react-router-dom"
import RTUIFormInput from "../RTUIFormInput"
import RTUIFormSubmit from "../RTUIFormSubmit"

class SignUpPane extends Component {
  render(){
    return (
      <div className="SignUpPane">
        <div className="width300 margin_auto top20 druk_small rotation_gray">Sign Up</div>
        <form onSubmit={this.props.handleSignUp}>
          <RTUIFormInput title="Email address" name="registerEmail" value={this.props.registerEmail} onChange={this.props.handleInputChange}/>
          <RTUIFormInput title="Password" name="registerPassword" value={this.props.registerPassword} onChange={this.props.handleInputChange} type="password"/>
          <RTUIFormInput title="Confirm Password" name="registerConfirmPassword" value={this.props.registerConfirmPassword} onChange={this.props.handleInputChange} type="password"/>
          <div className="proxima_xs medium rotation_gray top10 text_center">By registering, I accept the <Link to="/terms" className="underline cursor_pointer">Terms of Service</Link> and <Link to="/privacy" className="underline cursor_pointer">Privacy Policy</Link></div>
          <RTUIFormSubmit title="Sign Up" />
        </form>
        <div className="proxima_small medium underline rotation_gray top10 bottom20 flex justify_center cursor_pointer" onClick={this.props.handleLogInClicked}>Already have an account? Sign in</div>
      </div>
    )
  }
}

export default SignUpPane