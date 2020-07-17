import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class RTUICheckboxes extends Component {
  render(){
    return (      
      <div className={"confirm_modal_box width"+(this.props.width || "400")+" top20 padding_bottom5 rotation_gray_border"}>
        {this.props.children.map((blurb, index) => {
          return (
            <div className="flex_no_wrap" key={index}>
              <FontAwesomeIcon className="checkbox_icon rotation_gray font12 right20" icon="check-square" />
              <div className="proxima_small rotation_gray padding_top4 checkbox_blurb_width">{blurb}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default RTUICheckboxes
