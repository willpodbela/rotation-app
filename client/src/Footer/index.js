import React from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Footer = props => {
    return (
      <div className="Footer">
        <footer className="footer_8 bg_dark_gray padding_top40 padding_bottom20">
          <div className="container nopadding">
            <div className="flex justify_between inner">
              <div className="top10 bottom30 block block_left text-center text-lg-left">
                <a href="/" className="ubuntu font20 font_second white">the rotation</a>
              </div>
              <div className="top10 bottom30 block block_center text-center">
                <a href="#" className="font12 uppercase spacing15 link white sides15">Privacy</a>
                <a href="mailto:support@therotation.club" target="_top" className="font12 uppercase spacing15 link white sides15">Contact</a>
              </div>
              <div className="top10 bottom30 block block_right text-center text-lg-right">
                <a href="#" className="link white text-center left10"><FontAwesomeIcon className="line_height50" icon={["fab", "twitter"]} /></a>
                <a href="#" className="link white text-center left10"><FontAwesomeIcon className="line_height50" icon={["fab", "facebook"]} /></a>
                <a href="#" className="link white text-center left10"><FontAwesomeIcon className="line_height50" icon={["fab", "instagram"]} /></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
}

export default Footer
