import React, { Component } from "react"
import "./bootstrap-modal.css"
import ItemCard from "../ItemCard"
import OnboardingModal from "../OnboardingModal"
import ItemModal from "../ItemModal"
import Auth from "../modules/Auth"
import "./style.css"
import RotationHelmet from "../RotationHelmet"

class CatalogPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      myRotation: [],
      upNext:[],
      favorites: [],
      items: [],
      designers: [],
      selectedItem: {},
      sizes: [
        {value: "S", selected: false},
        {value: "M", selected: false},
        {value: "L", selected: false},
        {value: "XL", selected: false}
      ],
      currentModal: false,
      forceSignUpFirst: false,
    }
    if(this.props.userLoggedIn){
      this.state.subscription = this.props.userLoggedIn.subscription || false
    }
  }

  componentDidMount(){
    // window.analytics.identify(this.props.userLoggedIn.id)
    window.analytics.page("Catalog"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
    
    if(this.props.auth){
      fetch("/api/web/items?sort_by_section=true", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Auth.getToken()}`
        }
      }).then(res => this.props.apiResponseHandler(res)).then(results => {
        this.setState({
          myRotation: this.addSelectedProperty(results.items.my_rotation),
          upNext: this.addSelectedProperty(results.items.up_next),
          favorites: this.addSelectedProperty(results.items.catalog.filter(item => item.is_favorite)),
          items: this.addSelectedProperty(results.items.catalog.filter(item => !item.is_favorite))
        })
        let designers = this.state.items.map(item => item.title)
        designers = Array.from(new Set(designers.map(designer => designer.value))).map(value => {
          return designers.find(designer => designer.value === value)
        })
        this.setState({designers: designers})
      })
    }else{
      fetch("/api/web/items", {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => this.props.apiResponseHandler(res)).then(results => {
        this.setState({items: this.addSelectedProperty(results.items)})
        let designers = this.state.items.map(item => item.title)
        designers = Array.from(new Set(designers.map(designer => designer.value))).map(value => {
          return designers.find(designer => designer.value === value)
        })
        this.setState({designers: designers})
      })
    }

  }

  addSelectedProperty(items){
    items.forEach(item => {
      item.title = {value: item.title, selected: false}
    })
    return items
  }

  filterDesigners(e){
    let itemsCopy = [...this.state.items]
    this.state.items.forEach((item, index) => {
      if(item.title.value === e.target.innerHTML){
        itemsCopy[index].title.selected ? itemsCopy[index].title.selected = false : itemsCopy[index].title.selected = true
      }
    })
    this.setState({items: itemsCopy})
    window.analytics.track('Filtered by Brand', {
      brand: e.target.innerHTML
    })
  }

  filterSizes(e){
    let sizesCopy = [...this.state.sizes]
    this.state.sizes.forEach((size, index) => {
      if(size.value === e.target.innerHTML){
        sizesCopy[index].selected ? sizesCopy[index].selected = false : sizesCopy[index].selected = true
      }
    })
    this.setState({sizes: sizesCopy})
    window.analytics.track('Filtered by Size', {
      size: e.target.innerHTML
    })
  }

  displayItemModal(e, item){
    this.setState({currentModal: "item", selectedItem: item})
    this.setBrowserURLwithoutRerender(this.itemDetailUrlForItem(item), ("The Rotation | "+item.title+" | "+item.subtitle))
    window.analytics.track('Product Viewed', {
      product_id: item.id,
      category: item.category,
      brand: item.title.value,
      name: item.subtitle,
      url: item.url,
      image_url: item.image_url
    })
  }
  
  setBrowserURLwithoutRerender(url, title="The Rotation | Catalog") {
    window.history.pushState({"pageTitle":title},title, url);
  }
  
  itemDetailUrlForItem(item) {
    var str = item.title.value+"-"+item.subtitle+"-"+item.id;
    str = str.replace(/\s+/g, '-').toLowerCase();
    return ("/catalog/"+str)
  }

  hideModal(e){
    if(this.state.currentModal === "item") {
      this.setBrowserURLwithoutRerender("/catalog")
    }
    
    this.setState({ currentModal: false })
  }

  getSizesAvailable(item){
    const sizes = item.sizes
    let availableSizes = []
    for(let size in sizes){
      if(sizes[size] > 0){
        availableSizes.push(size)
      }
    }
    return availableSizes
  }

  displayOnboardingModal(forceSignUpFirst = false) {
    this.setState({ currentModal: "onboarding", forceSignUpFirst: forceSignUpFirst })
  }
  
  itemUpdated(e, item) {
    //TODO: Update item in place to avoid networking call every time.
    this.hideModal(e)
    this.componentDidMount()
  }
  
  render(){
    const selectedItem = this.state.selectedItem
    const selectedSizes = this.state.sizes.filter(size => size.selected).map(size => size.value)
    const designersBeingFiltered = this.state.items.map(item => item.title.selected).includes(true)
    const sizesBeingFiltered = selectedSizes.length > 0
    
    var displayJoinBannerCTA = true
    if(this.props.userLoggedIn){
      displayJoinBannerCTA = !(this.props.auth && (this.props.userLoggedIn.subscription || false))
    }
    
    return (
      <div className="CatalogPage flex justify_center align_center gray_border_top padding_bottom300">
        <RotationHelmet title = "Clothing | The Rotation" />
        {displayJoinBannerCTA &&
          <div className="section cta">
            <div className="container w-container">
              <div className="cta-row w-row">
                <div className="w-col w-col-6 w-col-stack"></div>
                <div className="w-col w-col-6 w-col-stack">
                  <div className="left-block">
                    <h2 className="section-tittle cta">Access the largest private collection of men's streetwear and designer clothing - without limits.</h2>
                    <div className="cta-button-block">
                      <div onClick={(e) => this.displayOnboardingModal(true)} className="button white w-button">JOIN NOW</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }          
        <div className="catalog_wrapper padding_top25 flex sides13pct">
          <div className="filters_and_designers width150 padding_right10">
            <div className="fixed_sidebar overflow_scroll width150">
              <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Designers</div>
              <div>
                {this.state.designers.map((designer, index) => {
                  return (
                    <div
                      key={index}
                      onClick={(e) => this.filterDesigners(e)}
                      className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase"
                      style={{fontWeight: designer.selected ? "bold" : "normal"}}
                    >
                      {designer.value}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            {this.state.myRotation.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="catalog_title width_full left20 filters_title medium druk_xs rotation_gray padding_bottom20">My Rotation</div>
                {this.state.myRotation.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })}
              </div>
            }
            {this.state.upNext.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="catalog_title width_full left20 medium druk_xs rotation_gray padding_bottom10">Shipping Soon</div>
                <div className="width_full proxima_small rotation_gray left20 padding_bottom20">You can change these items anytime until your order leaves our warehouse.</div>
                {this.state.upNext.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })}
              </div>
              
            }
            {this.state.favorites.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="catalog_title width_full left20 medium druk_xs rotation_gray padding_bottom20">Favorites</div>
                {this.state.favorites.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })}
              </div>
            }
            <div className="catalog_section padding_top10 flex">
              <div className="catalog_headers flex justify_between width_full padding_bottom10">
                <div className="catalog_title druk_xs rotation_gray medium left20">Catalog</div>
                <div className="size_btns flex justify_between">
                  {(this.props.auth && this.state.subscription) &&
                    this.state.sizes.map((size, index) => {
                      return (
                        <div
                          key={index}
                          onClick={(e) => this.filterSizes(e)}
                          className="rotation_gray_border height40 width40 flex justify_center align_center proxima_large rotation_gray cursor_pointer"
                          style={{background: size.selected ? "#333333" : "#FFFFFF", color: size.selected ? "#FFFFFF" : "#333333"}}
                        >
                          {size.value}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {designersBeingFiltered && sizesBeingFiltered ? (
                this.state.items.map((item, index) => {
                  if(item.title.selected && this.getSizesAvailable(item).filter(size => selectedSizes.includes(size)).length > 0){
                    return (
                      <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                        <ItemCard item={item} />
                      </div>
                    )
                  }else{
                    return null
                  }
                })
              ) : designersBeingFiltered && !sizesBeingFiltered ? (
                this.state.items.map((item, index) => {
                  if(item.title.selected){
                    return (
                      <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                        <ItemCard item={item} />
                      </div>
                    )
                  }else{
                    return null
                  }
                })
              ) : !designersBeingFiltered && sizesBeingFiltered ? (
                this.state.items.map((item, index) => {
                  if(this.getSizesAvailable(item).filter(size => selectedSizes.includes(size)).length > 0){
                    return (
                      <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                        <ItemCard item={item} />
                      </div>
                    )
                  }else{
                    return null
                  }
                })
              ) : (
                this.state.items.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        
        {this.state.currentModal === "onboarding" &&
          <OnboardingModal
            auth={this.props.auth}
            userLoggedIn={this.props.userLoggedIn}
            onClose={(e) => this.hideModal(e)}
            apiResponseHandler={this.props.apiResponseHandler}
            errorHandler={this.props.errorHandler}
            handleSignUp={this.props.handleSignUp}
            handleLoginSubmit={this.props.handleLoginSubmit}
            forgotPassword={this.props.forgotPassword}
            promptSignUpFirst={this.state.forceSignUpFirst}
          />
        }
        {this.state.currentModal === "item" &&
          <ItemModal
            item={selectedItem}
            auth={this.props.auth}
            userLoggedIn={this.props.userLoggedIn}
            apiResponseHandler={this.props.apiResponseHandler}
            showOnboardingModal={(e) => this.displayOnboardingModal()}
            actionComplete={(e) => this.itemUpdated(e, selectedItem)}
            onClose={(e) => this.hideModal(e)}
          />
        }
      </div>
    )
  }
}

export default CatalogPage
