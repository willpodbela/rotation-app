import React, { Component }  from "react"
import { Link } from "react-router-dom"
import Auth from "../modules/Auth"
import "./style.css"

class Nav extends Component {
  render(){
    return (
      <div className="Nav flex align_center">
        <nav className="nav_elements flex justify_between align_center sides13pct">
          <Link to="/" className="flex align_center">
            <img srcSet={"../images/The-Rotation.png 1x, ../images/The-Rotation@2x.png 2x"} src={"../images/The-Rotation.png"} className="max_width_full" alt="" />
          </Link>
          {Auth.isUserAuthenticated() ? (
            <div className="flex">
              <div className="proxima_small bold padding_right20">
                <Link className="rotation_gray" to="/catalog">Catalog</Link>
              </div>
              <div className="proxima_small bold padding_right20">
                <Link className="rotation_gray" to="/faq">FAQ</Link>
              </div>
              <div className="proxima_small bold white padding_right20">
                <Link className="rotation_gray" to="/account">Account</Link>
              </div>
              <div className="proxima_small bold white">
                <Link className="rotation_gray" onClick={this.props.logoutUser}>Log Out</Link>
              </div>
            </div>
          ) : (
            <div className="flex align_center">
              <div className="proxima_small bold padding_right20">
                <Link className="rotation_gray" to="/login">Log In</Link>
              </div>
              <div className="proxima_small bold white padding_right20">
                <Link className="rotation_gray" to="/sign-up">Sign Up</Link>
              </div>
              <div className="proxima_small bold padding_right20">
                <Link className="rotation_gray" to="/faq">FAQ</Link>
              </div>
              <div>
                <div className="download_app_btn rotation_gray_border flex align_center justify_center">
                  <div className="proxima_small bold">
                    <a className="rotation_gray" href="https://apps.apple.com/us/app/com-rotationinc-rotation/id1404678165">Download App</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    )
  }
}

export default Nav
