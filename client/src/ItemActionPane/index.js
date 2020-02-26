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

class ItemActionPane extends Component {
  constructor(props){
    super(props)
    this.state = {
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
    if(this.props.userLoggedIn){
      this.state.subscription = this.props.userLoggedIn.subscription || false
    }
  }
  
  componentDidMount(){    
    this.setState({
      modalSizes: [
        {value: "S", selected: false, available: false},
        {value: "M", selected: false, available: false},
        {value: "L", selected: false, available: false},
        {value: "XL", selected: false, available: false}
      ]
    })
  }
  
  addSelectedProperty(items){
    items.forEach(item => {
      item.title = {value: item.title, selected: false}
    })
    return items
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
          "item_id": this.props.item.id,
          "size": this.state.modalSizes.find(size => size.selected).value
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Auth.getToken()}`
        }
      }).then(res => this.props.apiResponseHandler(res)).then(res => {
        if(this.props.actionComplete) {
          this.props.actionComplete(e) 
        }
      })
    }else{
      this.props.errorHandler({message: "Please select a size."})
    }
  }

  reserveButtonClicked(e){
    if(this.props.auth && this.state.subscription){
      this.reserveItem(e)
    }else{
      this.props.showOnboardingModal(e)
    }
  }

  removeItem(e){
    fetch(`/api/web/reservations/${this.props.item.reservation.id}`, {
      method: "DELETE",
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
  
  requestToBuy(e){
    fetch(`/api/web/reservations/${this.props.item.reservation.id}/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.props.apiResponseHandler(res, "We've recieved your request and a member of our team will be in contact with you shortly."))
    if(this.props.actionComplete) {
      this.props.actionComplete(e) 
    }
  }

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
  
  isMyRotation(item) {
    if(item.reservation) {
      return item.reservation.status !== "scheduled"
    }
  }
  
  isUpNext(item) {
    if(item.reservation) {
      return item.reservation.status === "scheduled"
    }
  }
  
  render(){
    const selectedItem = this.props.item
    const selectedSizes = this.state.sizes.filter(size => size.selected).map(size => size.value)    
    const myRotationItemSelected = this.isMyRotation(selectedItem)
    const upNextItemSelected = this.isUpNext(selectedItem)
    
    return (
      <div className="ItemActionPane height_full" style={{position: "relative"}}>
        <div className="modal_brand proxima_small rotation_gray opacity6 uppercase padding_sides50">{selectedItem.title.value}</div>
        <div className="modal_description overflow_scroll druk_medium rotation_gray line_height24 padding_sides50 capitalize">{selectedItem.subtitle}</div>
        {/* description should be fixed position from top of container */}
        <div className="product_description proxima_small overflow_scroll rotation_gray padding_sides50">{selectedItem.description}</div>
        {/* TODO - ADD COLOR AND CATEGORY */}
        {/* Buttons should be fixed position from bottom of container */}
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
          <div className="modal_buttons sides50 flex justify_between">
            <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}>Reserve</div>
            <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}><img src={Unfavorite} height="14" width="14" alt="" /></div>
          </div>
        )}
      </div>
    )
  }
}

export default ItemActionPane
