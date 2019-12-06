import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class ItemCard extends Component {
  render(){
    const item = this.props.item
    return (
      <div className="card_large padding_left20 padding_bottom20 cursor_pointer">
        <div className="item_card_large light_background flex align_center justify_center">
          <img className="blend_background max_width150" src={item.image_url} alt="" />
        </div>
        <div className="flex justify_between align_center padding_top10">
          <div className="proxima_small semibold rotation_gray uppercase overflow_scroll nowrap width190">{item.title.value}</div>
          <FontAwesomeIcon className="font14 rotation_gray" icon="heart" />
        </div>
        <div className="padding_top2 opacity7 proxima_small rotation_gray lowercase">{item.subtitle}</div>
      </div>
    )
  }
}

export default ItemCard
