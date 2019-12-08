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
      items: [],
      upNext:[],
      myRotation: [],
      favorites: [],
      showModal: false,
      modalItem: {},
      showError: false,
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
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    fetch("/items", {
      headers: {
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    .then(results => {
      results.json()
        .then(results => {
          let items = results.items
          items.forEach(item => {
            item.title = {value: item.title, selected: false}
          })
          this.setState({items: items})
        })
    })
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
      if(size.value === e.target.innerHTML){
        sizesCopy[index].selected ? sizesCopy[index].selected = false : sizesCopy[index].selected = true
      }else{
        if(size.selected){
          sizesCopy[index].selected = false
        }
      }
    })
    this.setState({modalSizes: sizesCopy})
  }

  reserveItem(e){
    const upNext = this.state.upNext
    if(upNext.length === 2){
      this.setState({showError: true})
    }else{
      let upNextCopy = [...upNext]
      upNextCopy.push(this.state.modalItem)
      this.setState({upNext: upNextCopy})
      this.hideModal(e)
    }
  }

  removeItem(e){
    let upNextCopy = [...this.state.upNext]
    upNextCopy.splice(upNextCopy.indexOf(this.state.modalItem), 1)
    this.setState({upNext: upNextCopy})
    this.hideModal(e)
  }

  displayModal(e, item){
    this.setState({showModal: true, modalItem: item})
  }

  hideModal(e){
    this.setState({showModal: false})
  }

  render(){
    if(!Auth.isUserAuthenticated()){
      return <Redirect to="/" />
    }
    let designers = this.state.items.map(item => item.title)
    designers = Array.from(new Set(designers.map(designer => designer.value))).map(value => {
      return designers.find(designer => designer.value === value)
    })
    const selectedItem = this.state.modalItem
    const reservedIDs = this.state.upNext.map(item => item.id)
    return (
      <div className="CatalogPage gray_border_top">
        {this.state.showError &&
          <ErrorMessage error={{message: "Only 2 items allowed in your Rotation"}}/>
        }
        <div className="catalog_wrapper padding_top25 flex justify_between sides13pct">
          <div className="filters_and_designers width150 padding_right10">
            <div className="fixed_sidebar overflow_scroll width150">
              <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Designers</div>
              <div>
                {designers.map((designer, index) => {
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
                      <ItemCard item={item}  />
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
                      <ItemCard item={item}  />
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
                      <ItemCard item={item}  />
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
              {this.state.items.map(item => item.title.selected).includes(true) || this.state.sizes.map(size => size.selected).includes(true) ? (
                this.state.items.map((item, index) => {
                  if(item.title.selected && !reservedIDs.includes(item.id)){
                    return (
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
                        <ItemCard item={item}  />
                      </div>
                    )
                  }else{
                    return null
                  }
                })
              ) : (
                this.state.items.map((item, index) => {
                  if(!reservedIDs.includes(item.id)){
                    return (
                      <div key={index} onClick={(e) => this.displayModal(e, item)}>
                        <ItemCard item={item}  />
                      </div>
                    )
                  }else{
                    return null
                  }
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
                {this.state.modalSizes.map((size, index) => {
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
                })}
              </div>
              <div className="modal_buttons sides50 flex justify_between top40">
                {this.state.upNext.some(item => item.id === selectedItem.id) ? (
                  <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer red" onClick={(e) => this.removeItem(e)}>Remove</div>
                ) : (
                  <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveItem(e)}>Reserve</div>
                )}
                <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer"><FontAwesomeIcon className="rotation_gray" icon="heart" /></div>
              </div>
            </div>
          </Modal>
        }
      </div>
    )
  }
}

export default CatalogPage
