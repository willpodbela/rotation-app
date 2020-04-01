import React, { Component }  from "react"
import "./style.css"
import Auth from "../modules/Auth"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import OnboardingModal from "../OnboardingModal"
import ItemActionPane from "../ItemActionPane"

class ItemDetailPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      item: false,
      onboardingModal: false,
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
      var item = result.item
      window.analytics.page("Item Detail", {
        item: item.title+" "+item.subtitle,
        id: item.id
      }); // Name of this page view for analytics purposes 
      window.analytics.track('Product Viewed', {
        product_id: item.id,
        category: item.category,
        brand: item.title.value,
        name: item.subtitle,
        url: item.url,
        image_url: item.image_url
      })
      
      this.setState({item: item})
    })
  }
  
  showOnboardingModal(e) {
    this.setState({ onboardingModal: true })
  }
  
  hideOnboardingModal(e) {
    this.setState({ onboardingModal: false })
  }
  
  actionComplete(e, item) {
    window.location.reload(true)
  }

  render(){
    const item = this.state.item
    console.log(item)
    console.log(item.title)
    return (
      <div className="ItemDetailPage">
        <Link to="/catalog" className="flex left13pct width80 rotation_gray cursor_pointer">
          <div><FontAwesomeIcon className="font14" icon="chevron-left" /></div>
          <div className="proxima_small spacing30 uppercase bold left20 flex align_center">Back</div>
        </Link>
        {item &&
          <div className="flex justify_center top30 bottom100">
            <div className="width650 height650 light_background flex justify_center align_center">
              <img src={item.image_url} className="item_detail_page_image blend_background" alt="" />
            </div>
            <div className="width400">
              <ItemActionPane
                item={item}
                auth={this.props.auth}
                userLoggedIn={this.props.userLoggedIn}
                apiResponseHandler={this.props.apiResponseHandler}
                showOnboardingModal={(e) => this.showOnboardingModal(e)}
                actionComplete={(e) => this.actionComplete(e, item)}
              />
            </div>
          </div>
        }
        {this.state.onboardingModal &&
          <OnboardingModal
            auth={this.props.auth}
            userLoggedIn={this.props.userLoggedIn}
            onClose={(e) => this.hideOnboardingModal(e)}
            apiResponseHandler={this.props.apiResponseHandler}
            errorHandler={this.props.errorHandler}
            handleSignUp={this.props.handleSignUp}
            handleLoginSubmit={this.props.handleLoginSubmit}
            forgotPassword={this.props.forgotPassword}
          />
        }
      </div>
    )
  }
}

export default ItemDetailPage
