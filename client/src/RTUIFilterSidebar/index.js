import React, { Component } from "react"

class RTUIFilterSidebar extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      options: this.dressOptions(this.props.options),
      singleSelect: (this.props.singleSelect || false)
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.options !== prevProps.options) {
      this.setState({ options: this.dressOptions(this.props.options) })
    }
  }
  
  dressOptions(options) {
    var ret = []
    if(options.constructor === Object) {
      ret = Object.keys(options).map(opt => {
        return {value: opt, selected: false, children: this.dressOptions(options[opt])}
      })
    } else {
      ret = options.map(opt => {
        return {value: opt, selected: false, children: null}
      })
    }
    ret.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
    return ret
  }
  
  // returns an array, first value is the new options true, second value is wether or not the value was found in that tree
  toggleSelected(options, value) {
    if(options) {
      var found = false
      var copy = [...options]
      options.forEach((option, index) => {
        var foundInChildren = false
        if(option.children) {
          var childrenValues = this.toggleSelected(option.children, value)
          copy[index].children = childrenValues[0]
          foundInChildren = childrenValues[1]
        }
        if(this.state.singleSelect) {
          if(option.value === value){
            copy[index].selected = !copy[index].selected
          } else {
            copy[index].selected = foundInChildren
          }
        } else {
          if(option.value === value){
            copy[index].selected = !copy[index].selected
          }
        }
        found = found || (option.value === value) || foundInChildren
      })
      return [copy, found]
    } else {
      return [null, false]
    }
  }
  
  getSelectedValues(options) {
    if(options) {
      var ret = []
      options.forEach(option => {
        var selectedChildren = this.getSelectedValues(option.children)
        if(this.state.singleSelect) {
          if(selectedChildren.length) {
            ret = ret.concat(selectedChildren)
          } else if(option.selected) {
            ret.push(option.value)
          }
        } else {
          ret = ret.concat(selectedChildren)
          if(option.selected) {
            ret.push(option.value)
          }
        }
      })
      return ret
    } else {
      return []
    }
  }
  
  filterClicked(e) {
    var newOptions = this.toggleSelected(this.state.options, e.target.getAttribute('data-key'))[0]
    if(this.props.onFilterChange) {
      this.props.onFilterChange(this.getSelectedValues(newOptions))
    }
    this.setState({options: newOptions})
  }
  
  render(){    
    const OptionsList = ({ options }) => {
      return (
        <div>
          {options.map(option => (
            <div key={option.value}>
              <div
                data-key={option.value}
                onClick={(e) => this.filterClicked(e)}
                className="line_height16 proxima_small rotation_gray cursor_pointer padding_bottom5 uppercase"
                style={{fontWeight: option.selected ? "bold" : "normal"}}
              >
              {option.value}
              </div>
              {(option.children && (option.selected || this.getSelectedValues(option.children).length > 0)) &&
                <div className="left10">
                  <OptionsList
                    options={option.children}
                  />
                </div>
              }
            </div>
          ))}
        </div>
      )
    }
  
    return (
      <div className="padding_bottom20">
        <OptionsList
          options={this.state.options}
        />
      </div>
    )
  }
}

export default RTUIFilterSidebar
