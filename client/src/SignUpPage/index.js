import React, { Component } from "react"
import { Link, Redirect } from "react-router-dom"
import Auth from "../modules/Auth"
import ErrorMessage from "../ErrorMessage"

class SignUpPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      email: "",
      password: "",
      error: null,
      registerSuccess: false
    }
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleRegisterSubmit(e) {
    e.preventDefault()
        
    fetch("api/v1/users/sign_up", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        Auth.authenticateToken(res.user.auth_token)
        this.setState({
          auth: Auth.isUserAuthenticated(),
          registerSuccess: true
        })
      } else {
        console.log(res)
        this.setState({
          error: res
        })
      }
    }).catch(err => {
      console.log(err)
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
    if(this.state.registerSuccess){
      return (
        <Redirect to="/status" />      
      )
    } else {    
      return (
        <div className="SignUpPage">
          <ErrorMessage error={this.state.error}></ErrorMessage>
          <h1 className="ubuntu font42">Sign up</h1>
          <div className="max_width570 left_block">
            <form id="landing-form" className="max_width470 text_center top80 header_3_form" onSubmit={this.handleRegisterSubmit}>
              <input id="email" name="email" type="email" className="input width_full size60 radius6" placeholder="Email Address" onChange={this.handleInputChange} required/>
              <input id="password" name="password" type="password" className="input width_full size60 radius6 top30" placeholder="Password" onChange={this.handleInputChange} required/>
              <input id="password_confirmation" name="password_confirmation" type="password" className="input width_full size60 radius6 top30" placeholder="Confirm" onChange={this.handleInputChange} required/>
              <button type="submit" className="btn width_full size60 blue radius6 top30">Create an Account</button>
            </form>
            <div className="top30 medium_gray text text_center">By signing up, you agree to the <Link to="/">Terms of Service</Link></div>
            <div className="top10">
              TODO ADD LINK TO LOGIN after its built<br />
              TODO ADD LINK TO FORGOT after its built<br />
            </div>
          </div>
        </div>
      )
    }
  }
  
}

export default SignUpPage
