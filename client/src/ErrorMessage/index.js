import React, { Component } from "react"
import { Link } from "react-router-dom"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.error
    };
    
    this.handleDismiss = this.handleDismiss.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({error: nextProps.error});
  }
  
  handleDismiss() {
    this.setState({error: null});
  }
  
  render(){  
    return (   
      <ReactCSSTransitionGroup transitionName="alert" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        {this.state.error &&
        <div key="alert" className="ErrorMessage alert alert-danger alert-dismissible alert-form-error" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleDismiss} ><span aria-hidden="true">&times;</span></button>
          <span className="content">
            {this.state.error.message}
            {this.state.error.link &&
              <Link to={this.state.error.link.url}>{this.state.error.link.message}</Link>
            }
          </span>
        </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

export default ErrorMessage
