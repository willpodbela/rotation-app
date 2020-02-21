import React, { Component } from "react"

class RTUIFormSubmit extends Component {
  render(){
    return (
      <input type="submit" value={this.props.title} className="input_box rotation_gray_border rotation_gray_background width300 height50 margin_auto top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" />
    )
  }
}

export default RTUIFormSubmit
