import React, { Component }  from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./style.css"

class Footer extends Component {
  render(){
    return (
      <div className="Footer">
        <footer className="padding_top40 padding_bottom20">
          <div className="footer_container sides13pct">
            <div className="flex justify_between inner">
              <div className="width200 flex justify_left justify_center_under_960">
                <div className="top10 bottom30 block block_left text_center">
                  <Link to="/" className="druk_wide_logo font20 font_second white">The Rotation</Link>
                </div>
              </div>
              <div className="width200">
                <div className="top10 bottom30 block block_center text_center">
                  <Link to="/privacy" className="font12 uppercase spacing15 link white sides15">Privacy</Link>
                  <Link to="/faq" className="font12 uppercase spacing15 link white sides15">FAQ</Link>
                  <a href="mailto:support@therotation.club" target="_top" className="font12 uppercase spacing15 link white sides15">Contact</a>
                </div>
              </div>
              <div className="width200 flex justify_right justify_center_under_960">
                <div className="top10 bottom30 block block_right text_center">
                  {/* <a href="https://twitter.com/therotationclub" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "twitter"]} /></a> */}
                  <a href="https://www.facebook.com/therotation.club" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "facebook"]} /></a>
                  <a href="https://www.instagram.com/therotation.club" className="link white text-center left10"><FontAwesomeIcon className="fa line_height50" icon={["fab", "instagram"]} /></a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}

export default Footer
