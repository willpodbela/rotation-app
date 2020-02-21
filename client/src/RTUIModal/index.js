import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"

class RTUIModal extends Component {
  render(){
    return (
      <Modal show={this.props.show || true} dialogClassName="modal_item" centered>
        <div className="modal_section height500 width_full white_background">
          <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={this.props.onClose} icon="times" />
          <div className="top50 flex justify_center" style={{clear: "right"}}>
            {this.props.children}
          </div>
        </div>
      </Modal>
    )
  }
}

export default RTUIModal
