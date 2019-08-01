import React from "react"
import { Link } from "react-router-dom"
// import "../App.css"

const Nav = props => {
    return (
      <div className="Nav">
        <header className="header_11">
          <nav className="navigation_6 padding_top30 padding_bottom60 line_height40 transparent top30">
            <div className="container nopadding">
              <div className="float_left nav_logo">
                {/* <%= link_to("the rotation", root_path, style: "text-decoration: none; color: black;") %> */}
              </div>
              <div className="float_right">
                {/* <% if user_signed_in? %>
                  <%= link_to("Logout", destroy_user_session_path, method: :delete, class: "link dark_gray right30") %>
                  <%= link_to("Check Status", status_path, class: "link dark_gray right30") %>
                <% else %>
                  <%= link_to("Log in", new_user_session_path, class: "link dark_gray right30") %>
                  <%= link_to("Sign up", new_user_registration_path, class: "link dark_gray right30") %>
                <% end %>
                <%= link_to(download_path, class:"btn black size40 padding_sides20 right30") do %> */}
                  <i className="fab fa-apple right10"></i>Download App
                {/* <% end %> */}
              </div>
            </div>
          </nav>
          <div id="nav-container" style={{paddingBottom: "148px"}} className="container nopadding">
          </div>
        </header>
      </div>
    )
}

export default Nav
