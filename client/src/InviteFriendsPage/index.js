import React, { Component } from "react"
import logo from "../img/favicon.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class InviteFriendsPage extends Component {
  constructor(props){
    super(props)
  }
  
  render(){
    return (
      <div className="InviteFriendsPage padding_bottom170">
        <div className="text_center padding_top170 padding_bottom75"><img src={logo} className="rotation_logo" /></div>
        <div className="flex justify_center">
          <div className="padding_right240">
            <div className="invite_friends_title flex">Invite friends and earn up to $200 in rewards.</div>
            <div className="invite_friends_description padding_top20 flex">Use your very own link to spread the word about The Rotation. You’ll get cash to spend with us for every friend that signs up.</div>
          </div>
          
          <div className="invite_friends_right">
            <div className="personal_link padding_bottom25">YOUR PERSONAL LINK:</div>
            <div className="padding_bottom25">
              <div className="link_box flex align_center">
                <div className="link_text padding_left15">therotation.club?referralCode=aNeI67A&refSource=copy</div>
              </div>
            </div>
            <div>
              <div className="flex justify_between padding_bottom25">
                <div className="share_link flex justify_center align_center">COPY LINK</div>
                <div className="share_link flex justify_center align_center"><FontAwesomeIcon icon="envelope" className="invite_friends_icon" />EMAIL</div>
              </div>
              <div className="flex justify_between">
                <div className="share_link flex justify_center align_center"><FontAwesomeIcon icon="comment" className="invite_friends_icon" />SEND SMS</div>
                <div className="share_link flex justify_center align_center"><FontAwesomeIcon icon={["fab", "twitter"]} className="invite_friends_icon" />SHARE</div>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    )
  }
}

export default InviteFriendsPage