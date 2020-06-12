import React, { Component } from "react"
import Auth from "../modules/Auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"

class AutoPilotModal extends Component {
  
  toggleAutoPilot(e) {
    const newAutoPilotValue = !(this.props.autoPilot)
    fetch(`/api/web/users/${this.props.userLoggedIn.id}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      },
      body: JSON.stringify({
        auto_pilot: newAutoPilotValue
      })
    }).then(res => {
      if(this.props.actionComplete) {
        this.props.actionComplete(e)
      }
    })
  }

  render(){  
    return (
      <Modal show={this.props.show || true} dialogClassName="modal_item" centered>
        <div className="modal_section width_full white_background">
          <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={this.props.onClose} icon="times" />

          <div className="padding_top50 padding_bottom50 padding_sides50">

                <div className="top20 druk_small rotation_gray">Auto Pilot { this.props.userCanEnable && "Settings" }</div>
                { this.props.userCanEnable && 
                  <div>
                    <div className="top20 proxima_medium bold rotation_gray">Current Settings</div>
                    <div className="proxima_medium rotation_gray"> { (this.props.autoPilot) ? <div>Autopilot: ON</div> : <div>Autopilot: OFF</div> } </div>
                  </div>
                }
                <div className="top20 proxima_medium bold rotation_gray">How it works</div>
                
                <div className="rotation_gray_border flex align_center width_full padding_top15 padding_bottom15">
                  <FontAwesomeIcon className="rotation_gray font12 float_right padding_top15 padding_bottom15 padding_sides15" icon="check-square" />
                  <div className="line_height20 proxima_large text_left width630 medium rotation_gray">Once we receive your current items, we'll automatically put together your next box from your favorites</div>

                  <FontAwesomeIcon className="rotation_gray font12 float_right padding_top15 padding_bottom15 padding_sides15" icon="check-square" />
                  <div className="line_height20 proxima_large text_left width630 medium rotation_gray">You'll have 24 hours to review and change your items before shipment</div>

                  <FontAwesomeIcon className="rotation_gray font12 float_right padding_top15 padding_bottom15 padding_sides15" icon="check-square" />
                  <div className="line_height20 proxima_large text_left width630 medium rotation_gray">We'll prioritize what's most popular among the items you haven't rented</div>

                  <FontAwesomeIcon className="rotation_gray font12 float_right padding_top15 padding_bottom15 padding_sides15" icon="check-square" />
                  <div className="line_height20 proxima_large text_left width630 medium rotation_gray">We'll automatically select the right size based on your reservation history</div>
                </div>
                { this.props.userCanEnable ? (
                  <div className="rotation_gray_border rotation_gray_background width170 height50 top40 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={(e) => this.toggleAutoPilot(e)}> 
                    { (this.props.autoPilot) ? <div> TURN OFF</div> : <div>TURN ON</div> }
                    <FontAwesomeIcon className="white font12 left20" icon="chevron-right" />
                  </div>
                ) : (
                  <div className="rotation_gray_border rotation_gray_background width170 height50 top40 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" onClick={this.props.sendToSignUp ? this.props.sendToSignUp : this.props.onClose}> 
                    <div>JOIN NOW</div>
                    <FontAwesomeIcon className="white font12 left20" icon="chevron-right" />
                  </div>
                )}
          </div>
        </div>
      </Modal>
    )
  }
}

export default AutoPilotModal
