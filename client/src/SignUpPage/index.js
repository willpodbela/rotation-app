import React, { Component } from "react"
import { Link, Redirect } from "react-router-dom"
import "./style.css"
import image from "../img/sign-up.jpg"
import BannerImage from "../img/Rotation-Banner.jpg"
import { Helmet } from "react-helmet";
import RotationHelmet from "../RotationHelmet"

class SignUpPage extends Component {
  componentDidMount(){
    window.analytics.page("Sign Up"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
  }

  render(){
    if(this.props.auth){
      return <Redirect to="/catalog" />
    }
    return (
      <div className="SignUpPage light_background flex justify_center">
        <RotationHelmet title="Sign Up | The Rotation"/>
        <img className="login_image max_width400 top80 bottom80 sides70" src={image} alt="" />
        <div className="login_box gray_border white_background height400 width400 top180 bottom180 sides70">
          <div className="width300 margin_auto top20 druk_small rotation_gray">Sign Up</div>
          <form onSubmit={this.props.handleSignUp}>
            <div className="input_box gray_border width300 height50 margin_auto top15">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Email address</div>
              <input className="proxima_xl medium rotation_gray width260 left20" name="registerEmail" value={this.props.registerEmail} onChange={this.props.handleInputChange} />
            </div>
            <div className="input_box gray_border width300 height50 margin_auto top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Password</div>
              <input type="password" className="proxima_xl medium rotation_gray width260 left20" name="registerPassword" value={this.props.registerPassword} onChange={this.props.handleInputChange} />
            </div>
            <div className="input_box gray_border width300 height50 margin_auto top20">
              <div className="proxima_small medium very_light_gray left20 top5 height15">Confirm Password</div>
              <input type="password" className="proxima_xl medium rotation_gray width260 left20" name="registerConfirmPassword" value={this.props.registerConfirmPassword} onChange={this.props.handleInputChange} />
            </div>
            <div className="proxima_xs medium rotation_gray top10 text_center">By registering, I accept the <Link to="/terms" className="underline cursor_pointer">Terms of Service</Link> and <Link to="/privacy" className="underline cursor_pointer">Privacy Policy</Link></div>
            <input type="submit" value="Sign Up" className="input_box rotation_gray_border rotation_gray_background width300 height50 margin_auto top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" />
          </form>
          <Link to="/login" className="proxima_small medium underline rotation_gray top10 flex justify_center cursor_pointer">Already have an account? Sign in</Link>
        </div>
      </div>
    )
  }
}

export default SignUpPage
