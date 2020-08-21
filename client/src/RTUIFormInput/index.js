import React, { Component } from "react"
import InputMask from "react-input-mask"

class RTUIFormInput extends Component {
  render(){
    return (
      <div className={"input_box gray_border width"+(this.props.width || "300")+" height50 top20"}>
        <div className="proxima_small medium very_light_gray left20 top5 height15">{this.props.title}</div>
        <InputMask className={"input_field proxima_xl medium rotation_gray width"+ (this.props.width - 40 || "260") + " left20 gray_placeholder nopadding_left"} type={this.props.type || "text"} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.onChange} mask={this.props.mask} maskChar={this.props.maskChar} />
      </div>
    )
  }
}

export default RTUIFormInput
