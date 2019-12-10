import React, { Component } from "react"
import { Link } from "react-router-dom"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ErrorMessage extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: (props.error || false)
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({error: (nextProps.error || false)})
  }

  handleDismiss(e){
    this.props.onClose()
    this.setState({error: false})
  }

  render(){
    if (this.state.error) {
      return (
        <ReactCSSTransitionGroup transitionName="alert" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          <div key="alert" className="ErrorMessage alert alert-danger alert-dismissible alert-form-error" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e) => this.handleDismiss(e)}><span aria-hidden="true">&times;</span></button>
            <span className="content">
              {this.state.error.message}
              {this.state.error.link &&
                <Link to={this.state.error.link.url}>{this.state.error.link.message}</Link>
              }
            </span>
          </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      return(null)
    }
  }
}

export default ErrorMessage
