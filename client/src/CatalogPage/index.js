import React, { Component } from "react"
import { StickyContainer, Sticky } from 'react-sticky'
import "./bootstrap-modal.css"
import ItemCard from "../ItemCard"
import OnboardingModal from "../OnboardingModal"
import ItemModal from "../ItemModal"
import Auth from "../modules/Auth"
import RTUIFilterSidebar from "../RTUIFilterSidebar"
import "./style.css"
import RotationHelmet from "../RotationHelmet"

class CatalogPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items:[],
      designers: [],
      categories: {},
      selectedDesigners: [],
      selectedCategories: [],
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
    window.analytics.page("Catalog"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
    
    var headers = { "Content-Type": "application/json" }
    if(this.props.auth){
      headers["Authorization"] = `Token ${Auth.getToken()}`
    }
    fetch("/api/web/items", {
      headers: headers
    }).then(res => this.props.apiResponseHandler(res)).then(results => {
      this.setState({
        items: results.items,
        designers: [...new Set(results.items.map(item => item.title))],
        categories: this.buildCategoryTree(results.items)
      })
    })
  }
  
  buildCategoryTree(items) {
    var tree = {}
    for (var item of items) {
      if(item.category){
        if(!tree[item.category]) {
          tree[item.category] = []
        }
        if(item.sub_category){
          if(!tree[item.category].includes(item.sub_category)){
            tree[item.category].push(item.sub_category)
          }
        }
      }
    }
    return tree
  }
  
  filteredAndSortedItems() {
    var displayItems = {
      rotation: [],
      next: [],
      favorites: [],
      catalog: []
    }
    
    for (var item of this.state.items) {
      if(item.reservation) {
        var res = item.reservation
        if (res.status === "active" || res.status === "processing") {
            displayItems.rotation.push(item)
        } else if (res.status === "scheduled") {
            displayItems.next.push(item)
        }
      } else if (item.is_favorite) {
        displayItems.favorites.push(item)
      } else {
        displayItems.catalog.push(item)
      }
    }
    
    var selectedSizes = this.state.sizes.filter(size => size.selected).map(size => size.value)
    if(selectedSizes.length) {
      displayItems.catalog = displayItems.catalog.filter(item => this.getSizesAvailable(item).filter(size => selectedSizes.includes(size)).length > 0)
    }
    if(this.state.selectedDesigners.length) {
      displayItems.catalog = displayItems.catalog.filter(item => this.state.selectedDesigners.includes(item.title))
    }
    if(this.state.selectedCategories.length) {
      displayItems.catalog = displayItems.catalog.filter(item => (this.state.selectedCategories.includes(item.category) || this.state.selectedCategories.includes(item.sub_category)))
    }
    
    return displayItems
  }
  
  filterDesigners(selectedFilters){
    this.setState({selectedDesigners: selectedFilters})
  }
  
  filterCategories(selectedFilters){
    this.setState({selectedCategories: selectedFilters})
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
  }
  
  setBrowserURLwithoutRerender(url, title="The Rotation | Catalog") {
    window.history.pushState({"pageTitle":title},title, url);
  }
  
  itemDetailUrlForItem(item) {
    var str = item.title+"-"+item.subtitle+"-"+item.id;
    str = str.replace(/\s+/g, '-').replace(/\./g, '').toLowerCase();
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

  displayOnboardingModal(e,forceSignUpFirst = false) {
    e.stopPropagation()
    this.setState({ currentModal: "onboarding", forceSignUpFirst: forceSignUpFirst })
  }
  
  itemUpdated(e, item) {
    //TODO: Update item in place to avoid networking call every time.
    this.hideModal(e)
    this.componentDidMount()
  }
  
  render(){
    const selectedItem = this.state.selectedItem
    const displayItems = this.filteredAndSortedItems()
            
    var displayJoinBannerCTA = true
    if(this.props.userLoggedIn){
      displayJoinBannerCTA = !(this.props.auth && (this.props.userLoggedIn.subscription || false))
    }
    
    const CatalogSection = ({ children, items, title, subtitle, emptyDefault }) => {
      return (
        <div>
          {items.length > 0 ? (
            <div className="catalog_section padding_top10 flex">
              {children}
              {title &&
                <div className="catalog_title width_full left20 medium druk_xs rotation_gray padding_bottom10">{title}</div>
              }
              {subtitle &&
                <div className="width_full proxima_small rotation_gray left20 padding_bottom20">{subtitle}</div>          
              }
              {items.map((item, index) => {
                return (
                  <div key={index} onClick={(e) => this.displayItemModal(e, item)}>
                    <ItemCard 
                    item={item} 
                    auth={this.props.auth}
                    userLoggedIn={this.props.userLoggedIn}
                    apiResponseHandler={this.props.apiResponseHandler}
                    actionComplete={(e) => this.itemUpdated(e, selectedItem)}
                    showOnboardingModal={(e) => this.displayOnboardingModal(e)}
                    />
                  </div>
                )
              })}
            </div>
          ) : emptyDefault ? (
            <div className="catalog_section padding_top10 flex">
              {emptyDefault}
            </div>
          ) : (
            <span></span>
          )}
        </div>
      )
    }
    
    const EmptyCatalog = () => {
      return (
        <div>
          <div className="catalog_title druk_xs rotation_gray medium left20">Catalog</div>
          <div className="width_full proxima_small rotation_gray left20 padding_bottom20 padding_top20">Whoops! No items matching these criteria. Disable some of your filters to see more items.</div>
        </div>
      )
    }
    
    return (
      <div className="CatalogPage flex left-block justify_center align_center gray_border_top">
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
                      {/* TODO - Add 'Promotion Clicked' event in here  */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }          
        {this.state.items.length > 0 ? (
          <div className="catalog_wrapper flex sides13pct padding_bottom300">
            <StickyContainer>
              <div className="filters_and_designers width150 padding_right10">
                <Sticky>
                  {({
                    style
                  }) => (
                    <div className="overflow_scroll width150 padding_top10" style={style}>
                      <RTUIFilterSidebar
                        options={this.state.categories}
                        title={"Categories"}
                        singleSelect={true}
                        onFilterChange={(s) => this.filterCategories(s)}
                      />
                      <RTUIFilterSidebar
                        options={this.state.designers}
                        title={"Designers"}
                        onFilterChange={(s) => this.filterDesigners(s)}
                      />
                    </div>
                  )}
                </Sticky>
              </div>
            </StickyContainer>
            <div>
              <CatalogSection items={displayItems.rotation} title={"My Rotation"} />
              <CatalogSection items={displayItems.next} title={"Shipping Soon"} subtitle={"You can change these items anytime until your order leaves our warehouse."} />
              <CatalogSection items={displayItems.favorites} title={"Favorites"} />
              <CatalogSection items={displayItems.catalog}
                emptyDefault={ (this.state.selectedDesigners.length > 0 || this.state.selectedCategories.length > 0) ? <EmptyCatalog /> : null }
              >
                <div className="catalog_headers flex justify_between width_full padding_bottom10">
                  <div className="catalog_title druk_xs rotation_gray medium left20">Catalog</div>
                  <div className="size_btns flex justify_between">
                    {this.props.auth &&
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
              </CatalogSection>
            </div>
          </div>
        ) : (
          <div className={`width_full ${displayJoinBannerCTA ? "height300" : "height600"} flex align_center justify_center direction_column`}>
            <div className="rotation_gray druk_large">The Rotation</div>
            <div className="rotation_gray proxima_large">Loading catalog...</div>
          </div>
        )}
      
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
            showOnboardingModal={(e) => this.displayOnboardingModal(e)}
            actionComplete={(e) => this.itemUpdated(e, selectedItem)}
            onClose={(e) => this.hideModal(e)}
          />
        }
    </div>
    )
  }
}

export default CatalogPage
