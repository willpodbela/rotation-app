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
    fetch("/api/v1/items/list")
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
      <div className="BrowseCatalogPage gray_border_top">
        <div className="catalog_wrapper padding_top25 flex justify_between sides13pct">
          <div className="filters_and_designers width150 padding_right10">
            <div className="fixed_position width150">
              <div className="filters">
                <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Filters <FontAwesomeIcon className="float_right cursor_pointer" onClick={(e) => this.showHideFilters(e)} icon="plus-circle" /></div>
                <Collapse in={this.state.showFilters}>
                  <div>
                    <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase">Tees</div>
                    <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase">Jackets</div>
                    <div className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom30 uppercase">Accessories</div>
                  </div>
                </Collapse>
              </div>
              <div className="designers">
                <div className="filters_title medium druk_xs rotation_gray padding_bottom5">Designers <FontAwesomeIcon className="float_right cursor_pointer" onClick={(e) => this.showHideDesigners(e)} icon="plus-circle" /></div>
                <Collapse in={this.state.showDesigners}>
                  <div>
                    {designers.map((designer, index) => {
                      return (
                        <div key={index} onClick={(e) => this.filterItems(e)} className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase" style={{fontWeight: designer.selected ? "bold" : "normal"}}>{designer.value}</div>
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
                        <img className="blend_background max_width140" src={item.image_url} alt="" />
                      </div>
                      <div className="proxima_small semibold rotation_gray padding_top10 uppercase">{item.title.value}</div>
                      <div className="padding_top2 opacity7 proxima_small rotation_gray lowercase">{item.description}</div>
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
                      <img className="blend_background max_width140" src={item.image_url} alt="" />
                    </div>
                    <div className="proxima_small semibold rotation_gray padding_top10 uppercase">{item.title.value}</div>
                    <div className="padding_top2 opacity7 proxima_small rotation_gray lowercase">{item.description}</div>
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
