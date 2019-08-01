import React from "react"
import { Link } from "react-router-dom"

const Footer = props => {
    return (
      <div className="Footer">
        <footer className="footer_8 bg_dark_gray padding_top40 padding_bottom20">
          <div className="container nopadding">
            <div className="flex justify_between inner">
              <div className="top10 bottom30 block block_left text-center text-lg-left">
                {/* <%= link_to("the rotation", root_path, class: "ubuntu font20 font_second white") %> */}
              </div>
              <div className="top10 bottom30 block block_center text-center">
                {/* <%= link_to("Privacy", privacy_path, class: "font12 uppercase spacing15 link white sides15") %>
                <%= render('shared/links/contact') %> */}
              </div>
              <div className="top10 bottom30 block block_right text-center text-lg-right">
                <a href="#" className="link white text-center left10"><i className="fab fa-twitter line_height50"></i></a>
                <a href="#" className="link white text-center left10"><i className="fab fa-facebook line_height50"></i></a>
                <a href="#" className="link white text-center left10"><i className="fab fa-instagram line_height50"></i></a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
}

export default Footer
