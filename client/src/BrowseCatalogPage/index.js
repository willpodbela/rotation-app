import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Collapse from 'react-bootstrap/Collapse'
import "./bootstrap-collapse-show.css"

class BrowseCatalogPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      showFilters: true,
      showDesigners: true
    }
  }
  
  componentDidMount(){
    window.scrollTo(0, 0)
    let username = process.env.REACT_APP_API_AUTH_NAME
    let password = process.env.REACT_APP_API_AUTH_PASSWORD
        
    fetch("/api/v1/items/list", {
      headers: {
        "Authorization": `Basic ${Buffer.from(username + ":" + password).toString('base64')}`
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
  
  filterItems(e){
    let designerClicked = e.target.innerHTML
    let itemsCopy = JSON.parse(JSON.stringify(this.state.items))
    this.state.items.forEach((item, index) => {
      if(item.title.value.toUpperCase() === designerClicked){
        itemsCopy[index].title.selected ? itemsCopy[index].title.selected = false : itemsCopy[index].title.selected = true
      }
    })
    this.setState({items: itemsCopy})
  }
  
  showHideFilters(e){
    this.state.showFilters ? this.setState({showFilters: false}) : this.setState({showFilters: true})
  }
  
  showHideDesigners(e){
    this.state.showDesigners ? this.setState({showDesigners: false}) : this.setState({showDesigners: true})
  }
  
  render(){
    let designers = this.state.items.map(item => item.title)
    designers = Array.from(new Set(designers.map(designer => designer.value))).map(value => {
      return designers.find(designer => designer.value === value)
    })
    
    return (
      <div className="BrowseCatalogPage">
        <div className="catalog_wrapper padding_top25 flex justify_between sides13pct">
          <div className="filters_and_designers width150 padding_right10">
            <div className="fixed_position width150">
              <div className="filters">
                <div className="filters_title padding_bottom5">Filters <FontAwesomeIcon className="float_right" onClick={(e) => this.showHideFilters(e)} icon="plus-circle" /></div>
                <Collapse in={this.state.showFilters}>
                  <div>
                    <div className="filters_subtitle padding_bottom5">TEES</div>
                    <div className="filters_subtitle padding_bottom5">JACKETS</div>
                    <div className="filters_subtitle padding_bottom30">ACCESSORIES</div>
                  </div>
                </Collapse>
              </div>
              <div className="designers">
                <div className="filters_title padding_bottom5">Designers <FontAwesomeIcon className="float_right" onClick={(e) => this.showHideDesigners(e)} icon="plus-circle" /></div>
                <Collapse in={this.state.showDesigners}>
                  <div>
                    {designers.map((designer, index) => {
                      return (
                        <div key={index} onClick={(e) => this.filterItems(e)} className="filters_subtitle padding_bottom5" style={{fontWeight: designer.selected ? "bold" : "normal"}}>{designer.value.toUpperCase()}</div>
                      )
                    })}
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
          <div className="catalog flex">
            {this.state.items.map(item => item.title.selected).includes(true) ? (
              this.state.items.map((item, index) => {
                if(item.title.selected){
                  return (
                    <div key={index} className="card_large padding_left20 padding_bottom25">
                      <div className="item_card_large flex align_center justify_center">
                        <img className="item_image" src={item.image_url} alt="" />
                      </div>
                      <div className="brand padding_top10">{item.title.value.toUpperCase()}</div>
                      <div className="description padding_top5">{item.description.toLowerCase()}</div>
                    </div>
                  )
                }else{
                  return null
                }
              })
            ) : (
              this.state.items.map((item, index) => {
                return (
                  <div key={index} className="card_large padding_left20 padding_bottom25">
                    <div className="item_card_large flex align_center justify_center">
                      <img className="item_image" src={item.image_url} alt="" />
                    </div>
                    <div className="brand padding_top10">{item.title.value.toUpperCase()}</div>
                    <div className="description padding_top5">{item.description.toLowerCase()}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default BrowseCatalogPage