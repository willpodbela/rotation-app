import React, { Component } from "react"
import { Link, Redirect } from "react-router-dom"
import Auth from "../modules/Auth"
import "./style.css"
import image from "../img/sign-up.jpg"

class SignUpPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      authenticated: false,
      email: "",
      password: ""
    }
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleSignUp(e){
    e.preventDefault()
    fetch("/users", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    //handle errors here
    .then(res => res.json())
    .then(res => {
      const token = res.user.auth_token
      if(token){
        Auth.authenticateToken(token)
        this.setState({
          authenticated: true,
          username: "",
          password: ""
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  render(){
    if(this.state.authenticated){
      return <Redirect to="/catalog" />
    }
    return (
      <div className="SignUpPage light_background flex justify_center">
        <img className="max_width400 top80 bottom80 sides70" src={image} />
        <div className="login_box gray_border white_background height330 width400 top180 bottom180 sides70">
          <div className="width300 margin_auto top20 druk_small rotation_gray">Sign Up</div>
          <form onSubmit={(e) => this.handleSignUp(e)}>
            <div className="input_box gray_border width300 height50 margin_auto top15">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Email address</div>
              <input className="proxima_xl medium rotation_gray width260 left20" placeholder="mason@ramsey.com" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="input_box gray_border width300 height50 margin_auto top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Password</div>
              <input type="password" className="proxima_xl medium rotation_gray width260 left20" placeholder="•••••••••••••••" name="password" value={this.state.password} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className="proxima_xs medium rotation_gray top10 text_center">By registering, I accept the <Link to="/terms" className="underline cursor_pointer">Terms of Service</Link> and <Link to="/privacy" className="underline cursor_pointer">Privacy Policy</Link></div>
            <input type="submit" value="Sign Up" className="input_box rotation_gray_border rotation_gray_background width300 height50 margin_auto top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" />
          </form>
          <Link to="/login"><div className="proxima_small medium underline rotation_gray top10 text_center cursor_pointer">Already have an account? Sign in</div></Link>
        </div>
      </div>
    )
  }
}

export default SignUpPage
