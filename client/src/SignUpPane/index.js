import React, { Component } from "react"
import { Link } from "react-router-dom"
import RTUIFormInput from "../RTUIFormInput"
import RTUIFormSubmit from "../RTUIFormSubmit"

class SignUpPane extends Component {
  constructor(props){
    super(props)
    this.state = {
      registerEmail: "",
      registerPassword: "",
      registerConfirmPassword: ""
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
      <div className="SignUpPane width300 margin_auto">
        <div className="top20 druk_small rotation_gray">Sign Up</div>
        <form onSubmit={(e) => this.props.handleSignUp(e, this.state.registerEmail, this.state.registerPassword, this.state.registerConfirmPassword)}>
          <RTUIFormInput title="Email address" name="registerEmail" value={this.props.registerEmail} onChange={(e) => this.handleInputChange(e)}/>
          <RTUIFormInput title="Password" name="registerPassword" value={this.props.registerPassword} onChange={(e) => this.handleInputChange(e)} type="password"/>
          <RTUIFormInput title="Confirm Password" name="registerConfirmPassword" value={this.props.registerConfirmPassword} onChange={(e) => this.handleInputChange(e)} type="password"/>
          <div className="proxima_xs medium rotation_gray top10 text_center">By registering, I accept the <Link to="/terms" className="underline cursor_pointer">Terms of Service</Link> and <Link to="/privacy" className="underline cursor_pointer">Privacy Policy</Link></div>
          <RTUIFormSubmit title="Sign Up" />
        </form>
        <div className="proxima_small medium underline rotation_gray top10 bottom20 flex justify_center cursor_pointer" onClick={this.props.handleLogInClicked}>Already have an account? Sign in</div>
      </div>
    )
  }
}

export default SignUpPane