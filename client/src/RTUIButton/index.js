import React, { Component } from "react"

class RTUIButton extends Component {
  render(){
    return (      
      <div className="input_box rotation_gray_border rotation_gray_background width300 height50 top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={this.props.onClick} >
        {this.props.children}
      </div>
    )
  }
}

export default RTUIButton
