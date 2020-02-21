import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class ModalContainer extends Component {
  render(){
    return (
      <div className="modal_section height500 width_full white_background">
        <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={(e) => this.hideModal(e)} icon="times" />
        <div className="top50 flex justify_center" style={{clear: "right"}}>
          {this.props.inside}
        </div>
      </div>
    )
  }
}

export default ModalContainer
