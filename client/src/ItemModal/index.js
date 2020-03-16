import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"
import Auth from "../modules/Auth"
import ItemActionPane from "../ItemActionPane"

class ItemModal extends Component {
  
  componentDidMount(){  
    window.analytics.page("Item Detail Modal", {
      item: this.props.item.title+" "+this.props.item.subtitle,
      id: this.props.item.id
    });
  }
  
  render(){
    return (
      <Modal show={this.props.show || true} dialogClassName="modal_item" centered>
        <div className="flex">
          <div className="modal_section overflow_hidden height500 width_half light_background flex justify_center align_center">
            <img className="modal_image blend_background" src={this.props.item.image_url} alt="" />
          </div>
          <div className="modal_section height500 width_half white_background">
            <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={this.props.onClose} icon="times" />
            <div className="top50">
              <ItemActionPane
                item={this.props.item}
                auth={this.props.auth}
                userLoggedIn={this.props.userLoggedIn}
                apiResponseHandler={this.props.apiResponseHandler}
                showOnboardingModal={this.props.showOnboardingModal}
                actionComplete={this.props.actionComplete}
              />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ItemModal
