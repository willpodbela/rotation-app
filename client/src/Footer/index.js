import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./style.css"

const Footer = props => {
    return (
      <div className="Footer">
        <footer className="footer_8 bg_dark_gray padding_top40 padding_bottom20">
          <div className="container padding_sides50">
            <div className="flex justify_between inner">
              <div className="top10 bottom30 block block_left text-center text-lg-left">
                <Link to="/" className="ubuntu font20 font_second white">the rotation</Link>
              </div>
              <div className="top10 bottom30 block block_center text-center">
                <Link to="/privacy" className="font12 uppercase spacing15 link white sides15">Privacy</Link>
                <a href="mailto:support@therotation.club" target="_top" className="font12 uppercase spacing15 link white sides15">Contact</a>
              </div>
              <div className="top10 bottom30 block block_right text-center text-lg-right">
                <a href="https://twitter.com/therotationclub" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "twitter"]} /></a>
                <a href="https://www.facebook.com/therotation.club" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "facebook"]} /></a>
                <a href="https://www.instagram.com/rotation.club" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "instagram"]} /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
}

export default Footer
