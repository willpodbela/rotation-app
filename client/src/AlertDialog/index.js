import React, { Component } from "react"
import { Link } from "react-router-dom"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class AlertDialog extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: (props.error || false),
      notice: (props.notice || false)
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      error: (nextProps.error || false),
      notice: (nextProps.notice || false)
    })
  }

  handleDismiss(e){
    this.props.onClose()
    this.setState({
      error: false,
      notice: false
    })
  }

  render(){
    return (
      <ReactCSSTransitionGroup transitionName="alert" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        {this.state.error ? (
          <div key="alert" className="AlertDialog alert alert-danger alert-dismissible alert-form-error" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e) => this.handleDismiss(e)}><span aria-hidden="true">&times;</span></button>
            <span className="content">
              {this.state.error.message}
              {this.state.error.link &&
                <Link to={this.state.error.link.url}>{this.state.error.link.message}</Link>
              }
            </span>
          </div>
        ) : this.state.notice ? (
          <div key="notice" className="AlertDialog alert alert-success alert-dismissible alert-form-success" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e) => this.handleDismiss(e)}><span aria-hidden="true">&times;</span></button>
            <span className="content">
              {this.state.notice.message}
              {this.state.notice.link &&
                <Link to={this.state.notice.link.url}>{this.state.notice.link.message}</Link>
              }
            </span>
          </div>
        ) : null }
      </ReactCSSTransitionGroup>
    )
  }
}

export default AlertDialog
