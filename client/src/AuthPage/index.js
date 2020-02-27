import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import "./style.css"
import RotationHelmet from "../RotationHelmet"

class AuthPage extends Component {
  componentDidMount(){
    window.analytics.page(this.props.pageTitle); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
  }
  
  render(){
    if(this.props.auth){
      return <Redirect to="/catalog" />
    }
    return (
      <div className="AuthPage light_background flex justify_center">
        <RotationHelmet title={this.props.pageTitle+" | The Rotation"} />
        <img className="login_image max_width400 top80 bottom80 sides70" src={this.props.image} alt="" />
        <div className="login_box gray_border white_background width400 top180 bottom180 sides70">
          {this.props.authPane}
        </div>
      </div>
    )
  }
}

export default AuthPage
