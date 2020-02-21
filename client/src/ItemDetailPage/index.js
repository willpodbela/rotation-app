import React, { Component }  from "react"
import "./style.css"
import Auth from "../modules/Auth"
import { Link, Redirect } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class ItemDetailPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      item: {},
      showOnboardingModal: false,
    }
  }

  componentDidMount(){   
    window.scrollTo(0, 0)
    
    const itemInfo = this.props.match.params.itemInfo.split("-")
    const id = itemInfo[itemInfo.length - 1]
    fetch(`/api/web/items/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(result => {
      this.setState({item: result.item})
      window.analytics.page("Item Detail", {
        item: result.item.title+" "+result.item.subtitle,
        id: result.item.id
      }); // Name of this page view for analytics purposes 
    })
  }

  render(){
    const item = this.state.item
    return (
      <div className="ItemDetailPage">
        <Link to="/catalog" className="flex left13pct width80 rotation_gray cursor_pointer">
          <div><FontAwesomeIcon className="font14" icon="chevron-left" /></div>
          <div className="proxima_small spacing30 uppercase bold left20 flex align_center">Back</div>
        </Link>
        <div className="flex justify_between sides13pct top30 bottom100">
          <div className="width650 height650 light_background flex justify_center align_center">
            <img src={item.image_url} className="max_height500 blend_background" alt="" />
          </div>
          <div className="width300">
            <div className="druk_medium rotation_gray medium">{item.title}</div>
            <div className="proxima_large rotation_gray medium capitalize">{item.subtitle}</div>
            <div className="height50 rotation_gray_border flex justify_center align_center top30 cursor_pointer">
              <div className="proxima_small rotation_gray spacing30 uppercase bold left20 flex align_center">Select a Size</div>
              <div className="left20"><FontAwesomeIcon className="font14" icon="chevron-down" /></div>
            </div>
            <div className="height50 rotation_gray_background flex justify_center align_center top15 cursor_pointer">
              <div className="proxima_small white spacing30 uppercase bold left20 flex align_center">Add to My Rotation</div>
            </div>
            <div className="proxima_small rotation_gray medium top30">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ItemDetailPage
