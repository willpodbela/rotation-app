import React, { Component } from "react"
import "./bootstrap-modal.css"
import Auth from "../modules/Auth"
import FavoriteButtonPane from "../FavoriteButtonPane"
import "./style.css"
import RotationHelmet from "../RotationHelmet"
import { JSONLD, Product, Generic, GenericCollection} from 'react-structured-data';


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
        if(this.props.itemReserved) {
          this.props.itemReserved(e, res.reservation)
          window.analytics.track('Product Added', {
            product_id: this.props.item.id,
            category: this.props.item.category,
            brand: this.props.item.title.value,
            name: this.props.item.subtitle,
            url: this.props.item.url,
            image_url: this.props.item.image_url
          }) 
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
        if(this.props.itemRemoved) {
          this.props.itemRemoved(e) 
          window.analytics.track('Product Removed', {
            product_id: this.props.item.id,
            category: this.props.item.category,
            brand: this.props.item.title.value,
            name: this.props.item.subtitle,
            url: this.props.item.url,
            image_url: this.props.item.image_url
          })
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
    if(this.props.onClose) {
      this.props.onClose(e) 
      window.analytics.track('Purchase Requested', {
        product_id: this.props.item.id,
        category: this.props.item.category,
        brand: this.props.item.title.value,
        name: this.props.item.subtitle,
        url: this.props.item.url,
        image_url: this.props.item.image_url,
        reservation_id: this.props.item.reservation.id
      })
    }
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
    const myRotationItemSelected = this.isMyRotation(selectedItem)
    const upNextItemSelected = this.isUpNext(selectedItem)
    
    return (
      <React.Fragment>
      <JSONLD>
        <Product 
          name={selectedItem.title + " " + selectedItem.subtitle} 
          description={selectedItem.description}
          image={selectedItem.image_url}
        >
          <Generic 
            type="brand"
            jsonldtype="Brand"
            schema={{
              name: selectedItem.title
            }}
          />
            <Generic type="offers" jsonldtype="Offer" schema={{price: "89.00", priceCurrency: "USD", availability: "http://schema.org/InStock"}}>
              <Generic type="seller" jsonldtype="Organization" schema={{name: "The Rotation"}} />
            </Generic>
          </Product>
        </JSONLD>
        
        <div className="ItemActionPane height_full" style={{position: "relative"}}>
          <div className="modal_brand proxima_small rotation_gray opacity6 uppercase">{selectedItem.title}</div>
          <div className="modal_description overflow_scroll druk_medium rotation_gray line_height24 capitalize">{selectedItem.subtitle}</div>
          <div className="product_description proxima_small overflow_scroll rotation_gray">{selectedItem.description}</div>
          {selectedItem.supplier_color &&
            <div className="product_description proxima_small overflow_scroll rotation_gray">Supplier Color: {selectedItem.supplier_color}</div>
          }  
          {(this.props.auth && this.state.subscription) &&
            <div className="modal_size_btns flex modal_buttons">
              {this.state.modalSizes.forEach(size => {
                size.available = selectedItem.sizes[size.value] > 0
              })}
              {myRotationItemSelected || upNextItemSelected ? (
                <div className="proxima_small rotation_gray uppercase">Reserved Size: {selectedItem.reservation.size}</div>
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
          }
          <div className="modal_buttons flex">
            {myRotationItemSelected ? (
              <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer green request_to_buy" onClick={(e) => this.requestToBuy(e)}>Request to Buy</div>
            ) : upNextItemSelected ? (
              <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer red" onClick={(e) => this.removeItem(e)}>Remove</div>
            ) : (
              <div className="reserve_btn rotation_gray_border proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveButtonClicked(e)}>Reserve</div>
            )}
            <div className="modal_btn rotation_gray_border like_btn flex justify_center align_center">
              <FavoriteButtonPane
                item={this.props.item}
                auth={this.props.auth}
                apiResponseHandler={this.props.apiResponseHandler}
                showOnboardingModal={this.props.showOnboardingModal}
                toggleFavorite={this.props.toggleFavorite}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ItemActionPane
