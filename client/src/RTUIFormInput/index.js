import React, { Component } from "react"

class RTUIFormInput extends Component {
  render(){
    return (
      <div className={"input_box gray_border width"+(this.props.width || "300")+" height50 top20"}>
        <div className="proxima_small medium very_light_gray left20 top5 height15">{this.props.title}</div>
        <input className="input_field proxima_xl medium rotation_gray width260 left20" type={this.props.type || "text"} name={this.props.name} value={this.props.value} onChange={this.props.onChange} />
      </div>
    )
  }
}

export default RTUIFormInput
