import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"
import "./bootstrap-modal.css"
import ItemCard from "../ItemCard"
import LoginPane from "../LoginPane"
import BillingPane from "../BillingPane"
import SignUpPane from "../SignUpPane"
import ShippingAddressPane from "../ShippingAddressPane"
import OnboardingModal from "../OnboardingModal"
import Auth from "../modules/Auth"
import { Link } from "react-router-dom"
import Unfavorite from "../img/Unfavorite.png"
import Favorite from "../img/Favorite.png"
import "./style.css"
import BannerImage from "../img/Rotation-Banner.jpg"
import { Helmet } from "react-helmet";
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
      showModal: false,
      selectedItem: {},
      sizes: [
        {value: "S", selected: false},
        {value: "M", selected: false},
        {value: "L", selected: false},
        {value: "XL", selected: false}
      ],
      modalSizes: [
        {value: "S", selected: false, available: false},
        {value: "M", selected: false, available: false},
        {value: "L", selected: false, available: false},
        {value: "XL", selected: false, available: false}
      ],
      modalViews: [
        {view: "reserve", display: true},
        {view: "onboarding", display: false},
        {view: "login", display: false},
        {view: "plan", display: false},
        {view: "billing", display: false},
        {view: "shipping", display: false},
        {view: "confirm", display: false}
      ],
      stripeID: ""
    }
    if(this.props.userLoggedIn){
      this.state.subscription = this.props.userLoggedIn.subscription || false
    }
  }

  componentDidMount(){
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
  }

  filterSizes(e){
    let sizesCopy = [...this.state.sizes]
    this.state.sizes.forEach((size, index) => {
      if(size.value === e.target.innerHTML){
        sizesCopy[index].selected ? sizesCopy[index].selected = false : sizesCopy[index].selected = true
      }
    })
    this.setState({sizes: sizesCopy})
  }

  toggleModalSizes(e){
    let sizesCopy = [...this.state.modalSizes]
    this.state.modalSizes.forEach((size, index) => {
      if(size.available && size.value === e.target.innerHTML){
        sizesCopy[index].selected ? sizesCopy[index].selected = false : sizesCopy[index].selected = true
      }else{
        sizesCopy[index].selected = false
      }
    })
    this.setState({modalSizes: sizesCopy})
  }

  reserveItem(e){
    if(this.state.modalSizes.some(size => size.selected === true)){
      fetch("/api/web/reservations", {
        method: "POST",
        body: JSON.stringify({
          "item_id": this.state.selectedItem.id,
          "size": this.state.modalSizes.find(size => size.selected).value
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Auth.getToken()}`
        }
      }).then(res => this.props.apiResponseHandler(res)).then(res => {
        this.hideModal(e)
        this.componentDidMount()
      })
    }else{
      this.props.errorHandler({message: "Please select a size."})
    }
  }

  reserveButtonClicked(e){
    if(this.props.auth){
      if(this.state.subscription){
        this.reserveItem(e)
      }else{
        this.toggleModal(e, "onboarding")
      }
    }else{
      this.toggleModal(e, "onboarding")
    }
  }

  removeItem(e){
    fetch(`/api/web/reservations/${this.state.selectedItem.reservation.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(res => {
      this.hideModal(e)
      this.componentDidMount()
    })
  }

  displayModal(e, item){
    this.setState({showModal: true, selectedItem: item})
    this.setBrowserURLwithoutRerender(this.itemDetailUrlForItem(item), ("The Rotation | "+item.title+" | "+item.subtitle))
  }
  
  setBrowserURLwithoutRerender(url, title="The Rotation | Catalog") {
    window.history.pushState({"pageTitle":title},title, url);
  }
  
  itemDetailUrlForItem(item) {
    var str = item.title.value+"-"+item.subtitle+"-"+item.id;
    str = str.replace(/\s+/g, '-').toLowerCase();
    return ("/catalog/"+str)
  }

  requestToBuy(e){
    fetch(`/api/web/reservations/${this.state.selectedItem.reservation.id}/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, "We've recieved your request and a member of our team will be in contact with you shortly."))
    this.hideModal(e)
  }

  favoriteItem(e){
    fetch(`/api/web/items/${this.state.selectedItem.id}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res)).then(res => {
      this.hideModal(e)
      this.componentDidMount()
    })
  }

  unfavoriteItem(e){
    fetch(`/api/web/items/${this.state.selectedItem.id}/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => {
      //TODO: Handle errors. Can't use apiResponseHandler in its current format since it always attempts to call .json()
      this.hideModal(e)
      this.componentDidMount()
    })
  }

  hideModal(e){
    var displayReserveModal = this.state.modalViews.find(view => view.view === "reserve").display
    if(displayReserveModal) {
      this.setBrowserURLwithoutRerender("/catalog")
    }
    
    this.setState({
      showModal: false,
      modalSizes: [
        {value: "S", selected: false, available: false},
        {value: "M", selected: false, available: false},
        {value: "L", selected: false, available: false},
        {value: "XL", selected: false, available: false}
      ]
    })
    this.toggleModal(e, "reserve")
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

  toggleModal(e, viewToToggle){
    let modalViewsCopy = [...this.state.modalViews]
    modalViewsCopy.forEach(view => {
      view.view === viewToToggle ? view.display = true : view.display = false
    })
    this.setState({modalViews: modalViewsCopy})
  }
  
  render(){
    const selectedItem = this.state.selectedItem
    const selectedSizes = this.state.sizes.filter(size => size.selected).map(size => size.value)
    const designersBeingFiltered = this.state.items.map(item => item.title.selected).includes(true)
    const sizesBeingFiltered = selectedSizes.length > 0
    const myRotationItemSelected = this.state.myRotation.some(item => item.id === selectedItem.id)
    const upNextItemSelected = this.state.upNext.some(item => item.id === selectedItem.id)
    const displayReserveModal = this.state.modalViews.find(view => view.view === "reserve").display
    const displayOnboardingModal = this.state.modalViews.find(view => view.view === "onboarding").display
    const planSelected = this.state.planOptions.find(plan => plan.selected)
    return (
      <div className="CatalogPage flex justify_center align_center gray_border_top padding_bottom300">
        <RotationHelmet title = "Clothing | The Rotation" />
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
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })}
              </div>
            }
            {this.state.upNext.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="catalog_title width_full left20 medium druk_xs rotation_gray padding_bottom20">Up Next</div>
                {this.state.upNext.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
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
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
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
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
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
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
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
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
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
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item} />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        
        {(this.state.showModal && displayOnboardingModal) &&
          <OnboardingModal
            auth={this.props.auth}
            userLoggedIn={this.props.userLoggedIn}
            onClose={(e) => this.hideModal(e)}
            apiResponseHandler={this.props.apiResponseHandler}
            errorHandler={(error) => this.props.errorHandler}
          />
        }
        {(this.state.showModal && displayReserveModal) &&
          <Modal show={this.state.showModal} dialogClassName="modal_item" centered>
            <div className="flex">
              <div className="modal_section overflow_hidden height500 width_half light_background flex justify_center align_center">
                <img className="modal_image blend_background" src={selectedItem.image_url} alt="" />
              </div>
              <div className="modal_section height500 width_half white_background">
                <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={(e) => this.hideModal(e)} icon="times" />
                <div className="modal_brand proxima_small rotation_gray opacity6 uppercase top50 padding_sides50">{selectedItem.title.value}</div>
                <div className="modal_description height180 overflow_scroll druk_medium rotation_gray line_height24 padding_top10 padding_sides50 capitalize">{selectedItem.subtitle}</div>
                {this.props.auth && this.state.subscription ? (
                  <div>
                    <div className="modal_size_btns flex top40 sides50 justify_between">
                      {this.state.modalSizes.forEach(size => {
                        size.available = selectedItem.sizes[size.value] > 0
                      })}
                      {myRotationItemSelected || upNextItemSelected ? (
                        this.state.modalSizes.map((size, index) => {
                          return (
                            <div
                              key={index}
                              className="modal_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center cursor_pointer"
                              style={{background: size.value === selectedItem.reservation.size ? "#333333" : size.available ? "#FFFFFF" : "#F2F2F2", color: size.value === selectedItem.reservation.size ? "#FFFFFF" : "#333333"}}
                            >
                              {size.value}
                            </div>
                          )
                        })
                      ) : (
                        this.state.modalSizes.map((size, index) => {
                          return (
                            <div
                              key={index}
                              onClick={(e) => this.toggleModalSizes(e)}
                              className="modal_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center cursor_pointer"
                              style={{background: !size.available ? "#F2F2F2" : size.selected ? "#333333" : "#FFFFFF", color: size.selected && size.available ? "#FFFFFF" : "#333333"}}
                            >
                              {size.value}
                            </div>
                          )
                        })
                      )}
                    </div>
                    <div className="modal_buttons sides50 flex justify_between top40">
                      {myRotationItemSelected ? (
                        <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer green request_to_buy" onClick={(e) => this.requestToBuy(e)}>Request to Buy</div>
                      ) : upNextItemSelected ? (
                        <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer red" onClick={(e) => this.removeItem(e)}>Remove</div>
                      ) : (
                        <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}>Reserve</div>
                      )}
                      {selectedItem.is_favorite ? (
                        <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.unfavoriteItem(e)}><img src={Favorite} height="14" width="14" alt="" /></div>
                      ) : (
                        <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.favoriteItem(e)}><img src={Unfavorite} height="14" width="14" alt="" /></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="modal_buttons sides50 flex justify_between top130">
                    <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}>Reserve</div>
                    <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}><img src={Unfavorite} height="14" width="14" alt="" /></div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        }
      </div>
    )
  }
}

export default CatalogPage
