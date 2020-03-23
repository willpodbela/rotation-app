import React, { Component } from "react"
import { Link } from "react-router-dom"
import RotationHelmet from "../RotationHelmet"
import "./style.css"


class NotFoundPage extends Component {
  componentDidMount(){
    window.analytics.page("Not Found"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
  }

  render(){
    return (    
        <div className="NotFoundPage light_background gray_border_top flex justify_center">
            <RotationHelmet title="Page Not Found | The Rotation" />
            <img className="pg_not_found_image max_width400 top80 bottom80 sides70" src={this.props.image} alt="" />

            <div className="text_box width255 top180 bottom180 sides70">
                <div className="bottom10 rotation_gray druk_xl">404!</div>
                <div className="bottom30 proxima_medium rotation_gray">The clothing you were looking for doesn’t exist. Let’s get you back on track.</div>

                <div className="to_catalog_button rotation_gray_background margin_auto flex cursor_pointer">
                    <Link to="/catalog" className="white uppercase spacing40 proxima_xs semibold line_height12 flex align_center margin_auto">back to our catalog</Link>
            </div>
            </div>
      </div>
    )
  }
}

export default NotFoundPage