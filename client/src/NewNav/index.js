import React from "react"
import { Link } from "react-router-dom"

const NewNav = props => {
  
  return (
    <div className="NewNav flex align_center">
      <nav className="flex justify_around align_center">
        <Link to="/" className="flex align_center">
          <img srcSet={"../images/The-Rotation.png 1x, ../images/The-Rotation@2x.png 2x"} src={"../images/The-Rotation.png"} className="max_width_full" alt="" />
        </Link>
        <div className="flex align_center">
          <div className="nav_elem padding_right20">
            <Link to="/">FAQ</Link>
          </div>
          <div className="nav_elem padding_sides20">
            <Link to="/">Clothing</Link>
          </div>
          <div className="nav_elem padding_sides20">
            <Link to="/">Designers</Link>
          </div>
          <div className="padding_left20">
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

export default NewNav
