import React, { Component } from "react"
import Unfavorite from "../img/Unfavorite.png"
import Favorite from "../img/Favorite.png"
import Auth from "../modules/Auth"

class FavoriteButtonPane extends Component {
  favoriteItem(e){
    e.stopPropagation()
    fetch(`/api/web/items/${this.props.item.id}/favorite`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(res => {
      if(this.props.actionComplete) {
      this.props.actionComplete(e)
      window.analytics.track('Product Added to Wishlist', {
        product_id: this.props.item.id,
        category: this.props.item.category,
        name: this.props.item.subtitle,
        brand: this.props.item.title.value,
        url: this.props.item.url,
        image_url: this.props.item.image_url
      }) 
      }
    })
  }

  unfavoriteItem(e){
    e.stopPropagation()
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
      window.analytics.track('Product Removed from Wishlist', {
        product_id: this.props.item.id,
        category: this.props.item.category,
        name: this.props.item.subtitle,
        brand: this.props.item.title.value,
        url: this.props.item.url,
        image_url: this.props.item.image_url
      }) 
      }
    })
  }

  render(){
    const selectedItem = this.props.item
    return (
        selectedItem.is_favorite ? (
            <div className="cursor_pointer" onClick={(e) => this.unfavoriteItem(e)}><img src={Favorite} height="14" width="14" alt="" /></div>
          ) : this.props.auth ? (
            <div className="cursor_pointer" onClick={(e) => this.favoriteItem(e)}><img src={Unfavorite} height="14" width="14" alt="" /></div>                
          ) : (
            <div className="cursor_pointer" onClick={(e) => this.props.showOnboardingModal(e,true)}><img src={Unfavorite} height="14" width="14" alt="" /></div>
          )
    )
  }

}

export default FavoriteButtonPane