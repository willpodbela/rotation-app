import React, { Component } from "react"

class LoginPane extends Component {
  render(){
    return (
      <div className="LoginPane">
        <div className="width300 margin_auto top20 druk_small rotation_gray">Log In</div>
        <form onSubmit={this.props.handleLoginSubmit}>
          <div className="input_box gray_border width300 height50 margin_auto top15">
            <div className="proxima_small medium very_light_gray left20 top5 height15">Email address</div>
            <input className="proxima_xl medium rotation_gray width260 left20" name="loginEmail" value={this.props.loginEmail} onChange={this.props.handleInputChange} />
          </div>
          <div className="input_box gray_border width300 height50 margin_auto top20">
            <div className="proxima_small medium very_light_gray left20 top5 height15">Password</div>
            <input type="password" className="proxima_xl medium rotation_gray width260 left20" name="loginPassword" value={this.props.loginPassword} onChange={this.props.handleInputChange} />
          </div>
          <div className="proxima_xs medium rotation_gray top10 text_center underline cursor_pointer" onClick={this.props.forgotPassword}>Forgot your password?</div>
          <input type="submit" value="Log In" className="input_box rotation_gray_border rotation_gray_background width300 height50 margin_auto top20 flex justify_center align_center proxima_xs white uppercase semibold spacing40 cursor_pointer" />
        </form>
        <div className="proxima_small medium underline rotation_gray top10 bottom20 flex justify_center cursor_pointer" onClick={this.props.handleSignUpClicked}>Don't have an account? Sign up</div>
      </div>
    )
  }
}

export default LoginPane