import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"
import "./bootstrap-modal.css"
import ItemCard from "../ItemCard"
import ErrorMessage from "../ErrorMessage"
import Auth from "../modules/Auth"
import { Redirect } from "react-router-dom"
import "./style.css"

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
      showSizeSelectionError: false,
      requestToBuyMessage: false,
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
      ]
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    fetch("/items?sort_by_section=true", {
      headers: {
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    .then(results => {
      results.json()
        .then(results => {
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
    })
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
      fetch("/reservations", {
        method: "POST",
        body: JSON.stringify({
          "item_id": this.state.selectedItem.id,
          "size": this.state.modalSizes.find(size => size.selected).value
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Auth.getToken()}`
        }
      }).then(res => res.json()).then(res => {
        console.log(res)
        //handle errors here
      })
      this.hideModal(e)
      window.location.reload(true)
    }else{
      this.setState({showSizeSelectionError: true})
    }
  }

  removeItem(e){
    fetch(`/reservations/${this.state.selectedItem.reservation.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => res.json()).then(res => {
      console.log(res)
      //handle errors here
    })
    this.hideModal(e)
    window.location.reload(true)
  }

  displayModal(e, item){
    this.setState({showModal: true, selectedItem: item})
  }

  requestToBuy(e){
    fetch(`/reservations/${this.state.selectedItem.reservation.id}/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    //handle errors here
    this.hideModal(e)
    this.setState({requestToBuyMessage: true})
  }

  favoriteItem(e){
    fetch(`/items/${this.state.selectedItem.id}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    //handle errors here
    this.hideModal(e)
    window.location.reload(true)
  }

  unfavoriteItem(e){
    fetch(`/items/${this.state.selectedItem.id}/favorite`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    //handle errors here
    this.hideModal(e)
    window.location.reload(true)
  }

  hideModal(e){
    this.setState({showModal: false})
    this.setState({modalSizes: [
      {value: "S", selected: false, available: false},
      {value: "M", selected: false, available: false},
      {value: "L", selected: false, available: false},
      {value: "XL", selected: false, available: false}
    ]})
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

  render(){
    if(!Auth.isUserAuthenticated()){
      return <Redirect to="/" />
    }
    const selectedItem = this.state.selectedItem
    const selectedSizes = this.state.sizes.filter(size => size.selected).map(size => size.value)
    const designersBeingFiltered = this.state.items.map(item => item.title.selected).includes(true)
    const sizesBeingFiltered = selectedSizes.length > 0
    const myRotationItemSelected = this.state.myRotation.some(item => item.id === selectedItem.id)
    const upNextItemSelected = this.state.upNext.some(item => item.id === selectedItem.id)
    return (
      <div className="CatalogPage gray_border_top">
        {this.state.showSizeSelectionError &&
          <ErrorMessage error={{message: "Please select a size."}}/>
        }
        {this.state.requestToBuyMessage &&
          <ErrorMessage error={{message: "We've recieved your request and a member of our team will be in contact with you shortly."}}/>
        }
        <div className="catalog_wrapper padding_top25 flex justify_between sides13pct">
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
                <div className="width_full left20 filters_title medium druk_xs rotation_gray padding_bottom20">My Rotation</div>
                {this.state.myRotation.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item} favorited={item.is_favorite} />
                    </div>
                  )
                })}
              </div>
            }
            {this.state.upNext.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="width_full left20 medium druk_xs rotation_gray padding_bottom20">Up Next</div>
                {this.state.upNext.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item} favorited={item.is_favorite} />
                    </div>
                  )
                })}
              </div>
            }
            {this.state.favorites.length > 0 &&
              <div className="catalog_section padding_bottom10 flex">
                <div className="width_full left20 medium druk_xs rotation_gray padding_bottom20">Favorites</div>
                {this.state.favorites.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item} favorited={item.is_favorite} />
                    </div>
                  )
                })}
              </div>
            }
            <div className="catalog_section padding_top10 flex">
              <div className="catalog_headers flex justify_between width_full padding_bottom10">
                <div className="catalog_title druk_xs rotation_gray medium left20">Catalog</div>
                <div className="size_btns flex justify_between">
                  {this.state.sizes.map((size, index) => {
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
                  })}
                </div>
              </div>
              {designersBeingFiltered && sizesBeingFiltered ? (
                this.state.items.map((item, index) => {
                  if(item.title.selected && this.getSizesAvailable(item).filter(size => selectedSizes.includes(size)).length > 0){
                    return (
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
                        <ItemCard item={item} favorited={item.is_favorite} />
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
                        <ItemCard item={item} favorited={item.is_favorite} />
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
                        <ItemCard item={item} favorited={item.is_favorite} />
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
                      <ItemCard item={item} favorited={item.is_favorite} />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        {this.state.showModal &&
          <Modal show={this.state.showModal} dialogClassName="modal_item" centered>
            <div className="modal_section height500 width_half light_background flex justify_center align_center">
              <img className="modal_image blend_background" src={selectedItem.image_url} alt="" />
            </div>
            <div className="modal_section height500 width_half white_background">
              <FontAwesomeIcon className="close_btn rotation_gray font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={(e) => this.hideModal(e)} icon="times" />
              <div className="modal_brand proxima_small rotation_gray opacity6 uppercase top50 padding_sides50">{selectedItem.title.value}</div>
              <div className="modal_description height180 overflow_scroll druk_medium rotation_gray line_height24 padding_top10 padding_sides50 capitalize">{selectedItem.subtitle}</div>
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
                  <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer green" onClick={(e) => this.requestToBuy(e)}>Request to Buy</div>
                ) : upNextItemSelected ? (
                  <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer red" onClick={(e) => this.removeItem(e)}>Remove</div>
                ) : (
                  <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveItem(e)}>Reserve</div>
                )}
                {selectedItem.is_favorite ? (
                  <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.unfavoriteItem(e)}><FontAwesomeIcon className="rotation_gray" icon="heart" /></div>
                ) : (
                  <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.favoriteItem(e)}><FontAwesomeIcon className="rotation_gray" icon="bullseye" /></div>
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
