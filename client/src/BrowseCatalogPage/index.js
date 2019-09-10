import React, { Component } from "react"

class BrowseCatalogPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      items: [],
      designers: []
    }
  }
  
  componentDidMount(){
    window.scrollTo(0, 0)
    let username = process.env.REACT_APP_API_AUTH_NAME;
    let password = process.env.REACT_APP_API_AUTH_PASSWORD;
        
    fetch("/api/v1/items/list", {
      headers: {
        "Authorization": `Basic ${Buffer.from(username + ":" + password).toString('base64')}`
      }
    })
      .then(results => {
        results.json()
          .then(results => {
            this.setState({items: results.items})
            this.populateDesigners()
          })
      })
  }
  
  populateDesigners(){
    let designers = this.state.items.map(item => item.title)
    designers = designers.filter((designer, index) => designers.indexOf(designer) === index)
    this.setState({designers: designers})
  }
  
  render(){
    return (
      <div className="BrowseCatalogPage padding_top25 flex justify_center">
        <div className="filters_and_designers width150 padding_right100 padding_left10">
          <div className="filters">
            <div className="filters_title padding_bottom5">Filters</div>
            <div className="filters_subtitle padding_bottom5">TEES</div>
            <div className="filters_subtitle padding_bottom5">JACKETS</div>
            <div className="filters_subtitle padding_bottom30">ACCESSORIES</div>
          </div>
          <div className="designers">
            <div className="filters_title padding_bottom5">Designers</div>
            {this.state.designers.map((designer, index) => {
              return (
                <div key={index} className="filters_subtitle padding_bottom5">{designer.toUpperCase()}</div>
              )
            })}
          </div>
        </div>
        <div className="catalog flex width720">
          {this.state.items.map((item, index) => {
            return (
              <div key={index} className="card_large padding_sides10 padding_bottom25">
                <div className="item_card_large flex align_center justify_center">
                  <img className="item_image" src={item.image_url} alt="" />
                </div>
                <div className="brand padding_top10">{item.title}</div>
                <div className="description padding_top5">{item.description.toLowerCase()}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default BrowseCatalogPage