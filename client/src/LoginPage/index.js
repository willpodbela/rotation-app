import React, { Component } from "react"
import Auth from "../modules/Auth"

class LoginPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      token: "",
      email: "",
      password: ""
    }
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  handleErrors(response){
    if(!response.ok){
      throw Error(response.statusText)
    }
    return response
  }

  handleLoginSubmit(e){
    e.preventDefault()
    fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    .then(response => this.handleErrors(response))
    .then(res => res.json())
    .then(res => {
      if(res.auth_token){
        Auth.authenticateToken(res.auth_token)
        this.setState({
          token: res.auth_token,
          username: "",
          password: ""
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  render(){
    return (
      <div className="LoginPage">
        <form onSubmit={(e) => this.handleLoginSubmit(e)}>
          <input className="font30" placeholder="Email" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} />
          <input className="font30" type="password" placeholder="Password" name="password" value={this.state.password} onChange={(e) => this.handleInputChange(e)} />
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

export default LoginPage
