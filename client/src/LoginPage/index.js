import React, { Component } from "react"
import { Link, Redirect } from "react-router-dom"
import "./style.css"
import image from "../img/login.jpg"

class LoginPage extends Component {
  render(){
    if(this.props.auth){
      return <Redirect to="/catalog" />
    }
    return (
      <div className="LoginPage light_background flex justify_center">
        <img className="login_image max_width400 top80 bottom80 sides70" src={image} alt="" />
        <div className="login_box gray_border white_background height300 width400 top180 bottom180 sides70">
          <div className="width300 margin_auto top20 druk_small rotation_gray">Log In</div>
          <form onSubmit={this.props.handleLoginSubmit}>
            <div className="input_box gray_border width300 height50 margin_auto top15">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Email address</div>
              <input className="proxima_xl medium rotation_gray width260 left20" placeholder="mason@ramsey.com" name="email" value={this.props.email} onChange={this.props.handleInputChange} />
            </div>
            <div className="input_box gray_border width300 height50 margin_auto top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Password</div>
              <input type="password" className="proxima_xl medium rotation_gray width260 left20" placeholder="•••••••••••••••" name="password" value={this.props.password} onChange={this.props.handleInputChange} />
            </div>
            <input type="submit" value="Log In" className="input_box rotation_gray_border rotation_gray_background width300 height50 margin_auto top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" />
          </form>
          <Link to="/sign-up" className="proxima_small medium underline rotation_gray top10 flex justify_center cursor_pointer">Don't have an account? Sign up</Link>
        </div>
      </div>
    )
  }
}

export default LoginPage
