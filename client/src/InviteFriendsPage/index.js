import React, { Component } from "react"
import logo from "../img/rotation-logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ProgressBar from "react-bootstrap/ProgressBar"

class InviteFriendsPage extends Component {
  constructor(props){
    super(props)
  }
  
  render(){
    // const numFriendsInvited = 3
    const numFriendsConfirmed = 4
    return (
      <div className="InviteFriendsPage padding_bottom170">
        <div className="text_center padding_top170 padding_bottom75"><img src={logo} className="rotation_logo" /></div>
        <div className="flex justify_evenly padding_bottom130">
          <div className="padding_bottom75">
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
              <div className="flex justify_between padding_bottom25 share_link_row">
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
        <div className="rewards_title text_center padding_bottom20">Keep Track of Your Rewards</div>
        <div className="rewards_description text_center margin_auto padding_bottom50">Return here to view your progress and see your rewards anytime. Don’t worry, we’ll email you a link.</div>
        <div className="rewards_bar_horizontal flex justify_center align_center padding_bottom100">
          <div>
            <div className="rewards_druk_text height38 flex align_end padding_bottom20">Friends Joined</div>
            <ProgressBar className="rewards_box" variant="light" now={100} />
            <div className="rewards_druk_text height38 padding_top20">Reward Won</div>
          </div>
          <div className="rewards_divider"></div>
          <div>
            <div className="rewards_druk_text height38 flex align_end justify_center padding_bottom20">1</div>
            <ProgressBar className="rewards_box" variant="light" min="0" max="1" now={numFriendsConfirmed} />
            <div className="rewards_text padding_top20 text_center">$20</div>
          </div>
          <div className="rewards_divider"></div>
          <div>
            <div className="rewards_druk_text height38 flex align_end justify_center padding_bottom20">5</div>
            <ProgressBar className="rewards_box" variant="light" min="1" max="5" now={numFriendsConfirmed} />
            <div className="rewards_text padding_top20 text_center">$80</div>
          </div>
          <div className="rewards_divider"></div>
          <div>
            <div className="rewards_druk_text height38 flex align_end justify_center padding_bottom20">20</div>
            <ProgressBar className="rewards_box" variant="light" min="5" max="20" now={numFriendsConfirmed} />
            <div className="rewards_text padding_top20 text_center">
              <div>$150</div>
              <div>+</div>
              <div>Limited Run</div>
              <div>TR Tee</div>
            </div>
          </div>
          <div className="rewards_divider"></div>
          <div>
            <div className="rewards_druk_text height38 flex align_end justify_center padding_bottom20">50</div>
            <ProgressBar className="rewards_box" variant="light" min="20" max="50" now={numFriendsConfirmed} />
            <div className="rewards_text padding_top20 text_center">
              <div>$150</div>
              <div>+</div>
              <div>Limited Run</div>
              <div>TR Tee</div>
              <div>+</div>
              <div>Limited TR Sling Bag</div>
            </div>
          </div>
          <div className="rewards_divider"></div>
        </div>
        
        <div className="rewards_bar_vertical padding_bottom50">
          <div className="rewards_row flex justify_center align_center">
            <div className="rewards_druk_text width120 text_center padding_left20">Friends Joined</div>
            <ProgressBar className="rewards_box vertical" variant="light" now={100} />
            <div className="rewards_druk_text width120 text_center padding_right20">Rewards Won</div>
          </div>
          <div className="rewards_divider_vertical margin_auto"></div>
          <div className="rewards_row flex justify_center align_center">
            <div className="rewards_druk_text width120 text_center padding_left20">1</div>
            <ProgressBar className="rewards_box vertical" variant="light" min="0" max="1" now={numFriendsConfirmed} />
            <div className="rewards_text width120 flex justify_center align_center padding_right20">$20</div>
          </div>
          <div className="rewards_divider_vertical margin_auto"></div>
          <div className="rewards_row flex justify_center align_center">
            <div className="rewards_druk_text width120 text_center padding_left20">5</div>
            <ProgressBar className="rewards_box vertical" variant="light" min="1" max="5" now={numFriendsConfirmed} />
            <div className="rewards_text width120 flex justify_center align_center padding_right20">$80</div>
          </div>
          <div className="rewards_divider_vertical margin_auto"></div>
          <div className="rewards_row flex justify_center align_center">
            <div className="rewards_druk_text width120 text_center padding_left20">20</div>
            <ProgressBar className="rewards_box vertical" variant="light" min="5" max="20" now={numFriendsConfirmed} />
            <div className="rewards_text width120 flex justify_center align_center padding_right20 text_center">$150 + Limited Run TR Tee</div>
          </div>
          <div className="rewards_divider_vertical margin_auto"></div>
          <div className="rewards_row flex justify_center align_center">
            <div className="rewards_druk_text width120 text_center padding_left20">50</div>
            <ProgressBar className="rewards_box vertical" variant="light" min="20" max="50" now={numFriendsConfirmed} />
            <div className="rewards_text width120 text_center flex justify_center align_center padding_right20">$150 + Limited Run TR Tee + Limited TR Sling Bag</div>
          </div>
          <div className="rewards_divider_vertical margin_auto"></div>
        </div>
        
        <div className="rewards_text text_center"><strong>{numFriendsConfirmed}</strong> friends have joined</div>
      </div>
    )
  }
}

export default InviteFriendsPage