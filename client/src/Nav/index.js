import React from "react"
import { Link } from "react-router-dom"

const Nav = props => {
  return (
    <div className="Nav flex align_center">
      <nav className="nav_elements flex justify_between align_center sides15pct">
        <Link to="/" className="flex align_center">
          <img srcSet={"../images/The-Rotation.png 1x, ../images/The-Rotation@2x.png 2x"} src={"../images/The-Rotation.png"} className="max_width_full" alt="" />
        </Link>
        <div className="flex align_center">
          {/* if user_signed_in?
            <div className="nav_elem padding_right20">
              <Link to="/">Logout</Link>
            </div>
            <div className="nav_elem padding_right20">
              <Link to="/">Check Status</Link>
            </div>
          else */}
            <div className="nav_elem padding_right20">
              <Link to="/">Log In</Link>
            </div>
            <div className="nav_elem padding_right20">
              <Link to="/">Sign Up</Link>
            </div>
          {/* end  */}
          <div>
            <div className="download_app_btn flex align_center justify_center">
              <div className="nav_elem">
                <a href="https://apps.apple.com/us/app/com-rotationinc-rotation/id1404678165">Download App</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav
