import React, { Component } from "react"
import { Link } from "react-router-dom"
import Auth from "../modules/Auth"
import Unfavorite from "../img/Unfavorite.png"
import Favorite from "../img/Favorite.png"
import "./style.css"
  
class ItemCard extends Component {
  
  favoriteItem(e){
    fetch(`/api/web/items/${this.props.item.id}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(res => {
      if(this.props.actionComplete) {
        this.props.actionComplete(e) 
      }
    })
  }

  unfavoriteItem(e){
    fetch(`/api/web/items/${this.props.item.id}/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => {
      //TODO: Handle errors. Can't use apiResponseHandler in its current format since it always attempts to call .json()
      if(this.props.actionComplete) {
        this.props.actionComplete(e) 
      }
    })
  }

  render(){
    const item = this.props.item
    return (
      <div className="card_large padding_left20 padding_bottom20 cursor_pointer">
        <div
          className="item_card_large light_background flex align_center justify_center"
          style={{
            backgroundImage: `url(${item.image_url})`
          }}>
        </div>
        <div className="flex justify_between align_center padding_top10">
          <div className="proxima_small semibold rotation_gray uppercase overflow_scroll nowrap width190">{item.title}</div>

          {this.props.auth && this.state.subscription ? (
          <div> 
            {item.is_favorite ? (
              <div className="cursor_pointer" onClick={(e) => this.unfavoriteItem(e)}><img src={Favorite} height="14" width="14" alt="" /></div>
            ) : (
              <div className="cursor_pointer" onClick={(e) => this.favoriteItem(e)}><img src={Unfavorite} height="14" width="14" alt="" /></div>
            )}
          </div>
          ) : (
            <div>
              {/* <Link to="/sign-up" className="cursor_pointer"><img src={Unfavorite} height="14" width="14" alt="" /></Link> */}
              <div onClick={(e) => this.props.showOnboardingModal(true)} className="cursor_pointer"><img src={Unfavorite} height="14" width="14" alt="" /></div>
            </div>
          )}
          
        </div>
        <div className="padding_top2 opacity7 proxima_small rotation_gray lowercase">{item.subtitle}</div>
      </div>
    )
  }
}

export default ItemCard
