import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Modal from "react-bootstrap/Modal"
import "./bootstrap-modal.css"
import ItemCard from "../ItemCard"

class BrowseCatalogPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      upNext:[],
      myRotation: [],
      showModal: false,
      modalItem: {}
    }
  }

  componentDidMount(){
    window.scrollTo(0, 0)
    fetch("/api/v1/items/list")
      .then(results => {
        results.json()
          .then(results => {
            let items = results.items
            items.forEach(item => {
              item.title = {value: item.title, selected: false}
            })
            // this.setState({items: items, upNext: items.slice(0,2), myRotation: items.slice(2,4)})
            this.setState({items: items})
          })
      })
  }

  filterItems(e){
    let itemsCopy = JSON.parse(JSON.stringify(this.state.items))
    this.state.items.forEach((item, index) => {
      if(item.title.value === e.target.innerHTML){
        itemsCopy[index].title.selected ? itemsCopy[index].title.selected = false : itemsCopy[index].title.selected = true
      }
    })
    this.setState({items: itemsCopy})
  }

  reserveItem(e){
    const upNext = this.state.upNext
    if(upNext.length === 2){
      console.log("only 2 items allowed")
    }else{
      let upNextCopy = JSON.parse(JSON.stringify(upNext))
      upNextCopy.push(this.state.modalItem)
      this.setState({upNext: upNextCopy})
      this.hideModal(e)
    }
  }

  removeItem(e){
    let upNextCopy = JSON.parse(JSON.stringify(this.state.upNext))
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
    let designers = this.state.items.map(item => item.title)
    designers = Array.from(new Set(designers.map(designer => designer.value))).map(value => {
      return designers.find(designer => designer.value === value)
    })
    const selectedItem = this.state.modalItem
    return (
      <div className="BrowseCatalogPage gray_border_top">
        <div className="catalog_wrapper padding_top25 flex justify_between sides13pct">
          <div className="filters_and_designers width150 padding_right10">
            <div className="fixed_position width150">
              <div className="filters">
                <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Filters</div>
                <div>
                  <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase">Tees</div>
                  <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase">Jackets</div>
                  <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom30 uppercase">Accessories</div>
                </div>
              </div>
              <div className="designers">
                <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Designers</div>
                <div>
                  {designers.map((designer, index) => {
                    return (
                      <div
                        key={index}
                        onClick={(e) => this.filterItems(e)}
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
          </div>
          <div>
            {this.state.myRotation.length > 0 &&
              <div className="my_rotation catalog_section padding_bottom10 flex">
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
              <div className="up_next catalog_section padding_bottom10 flex">
                <div className="width_full left20 filters_title medium druk_xs rotation_gray padding_bottom20">Up Next</div>
                {this.state.upNext.map((item, index) => {
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item}  />
                    </div>
                  )
                })}
              </div>
            }
            <div className="catalog_section padding_top10 flex">
              <div className="width_full left20 filters_title medium druk_xs rotation_gray padding_bottom20">Catalog</div>
              {this.state.items.map(item => item.title.selected).includes(true) ? (
                this.state.items.map((item, index) => {
                  if(item.title.selected){
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
                  return (
                    <div key={index} onClick={(e) => this.displayModal(e, item)}>
                      <ItemCard item={item}  />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        {this.state.showModal &&
          <Modal show={this.state.showModal} dialogClassName="item_modal" centered>
            <div className="height500 width_half light_background flex justify_center align_center">
              <img className="blend_background max_width250" src={selectedItem.image_url} alt="" />
            </div>
            <div className="height500 width_half white_background">
              <FontAwesomeIcon className="font20 float_right padding_top20 padding_bottom20 padding_sides25 cursor_pointer" onClick={(e) => this.hideModal(e)} icon="times" />
              <div className="proxima_small rotation_gray opacity6 uppercase top50 padding_sides50">{selectedItem.title.value}</div>
              <div className="modal_description druk_medium rotation_gray line_height24 padding_top10 padding_sides50 capitalize">{selectedItem.description}</div>
              <div className="height160 proxima_small rotation_gray line_height20 padding_top40 padding_sides50">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
              <div className="flex justify_between padding_top40">
                {this.state.upNext.some(item => item.id === selectedItem.id) ? (
                  <div className="reserve left50 proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer red" onClick={(e) => this.removeItem(e)}>Remove</div>
                ) : (
                  <div className="reserve left50 proxima_medium rotation_gray spacing10 flex justify_center align_center uppercase cursor_pointer" onClick={(e) => this.reserveItem(e)}>Reserve</div>
                )}
                <div className="like_button right50 flex justify_center align_center cursor_pointer"><FontAwesomeIcon icon="heart" /></div>
              </div>
            </div>
          </Modal>
        }
      </div>
    )
  }
}

export default BrowseCatalogPage
