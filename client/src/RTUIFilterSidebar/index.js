import React, { Component } from "react"

class RTUIFilterSidebar extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      options: this.computeOptionsFromProps()
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.options !== prevProps.options) {
      this.setState({ options: this.computeOptionsFromProps() })
    }
  }
  
  computeOptionsFromProps() {
    return this.props.options.map(option => { return {value: option, selected: false} })
  }
  
  filterClicked(e) {
    var copy = [...this.state.options]
    this.state.options.forEach((option, index) => {
      if(option.value === e.target.getAttribute('data-key')){
        copy[index].selected = !copy[index].selected
      }
    })
    
    if(this.props.onFilterChange) {
      var selected = [...new Set(this.state.options.map(opt => { return opt.selected ? opt.value : null }).filter(el => { return el != null }))]
      this.props.onFilterChange(selected)
    }
    
    this.setState({options: copy})
  }

  render(){
    return (
      <div className="padding_bottom20">
        {this.props.title &&
          <div className="catalog_title druk_xs rotation_gray medium padding_bottom10">{this.props.title}</div>
        }
        <div>
          {this.state.options.map((option, index) => {
            return (
              <div
                key={index}
                data-key={option.value}
                onClick={(e) => this.filterClicked(e)}
                className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase"
                style={{fontWeight: option.selected ? "bold" : "normal"}}
              >
                {option.value}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default RTUIFilterSidebar
