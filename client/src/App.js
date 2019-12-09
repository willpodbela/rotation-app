import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import TermsPage from "./TermsPage"
import PrivacyPage from "./PrivacyPage"
import CatalogPage from "./CatalogPage"
import AccountPage from "./AccountPage"
import Nav from "./Nav"
import Footer from "./Footer"
import Auth from "./modules/Auth"

import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
library.add(fab, fas)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      authenticated: Auth.isUserAuthenticated(),
      loginEmail: "",
      loginPassword: "",
      registerEmail: "",
      regsiterPassword: "",
      showForgotPasswordMessage: false,
      userLoggedIn: {}
    }
  }

  logoutUser(){
    fetch("/api/web/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    //handle errors here
    .then(res => {
      Auth.deauthenticateUser()
      this.setState({
        authenticated: Auth.isUserAuthenticated(),
        loginEmail: "",
        loginPassword: ""
      })
    })
  }

  forgotPassword(e){
    e.preventDefault()
    fetch("/api/web/auth/forgot", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.loginEmail
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    //handle errors here
    .then(res => {
      this.setState({showForgotPasswordMessage: true})
    })
  }

  handleSignUp(e){
    e.preventDefault()
    fetch("/api/web/users", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.registerEmail,
        password: this.state.registerPassword
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    //handle errors here
    .then(res => res.json())
    .then(res => {
      const token = res.user.auth_token
      if(token){
        Auth.authenticateToken(token)
        this.setState({
          authenticated: Auth.isUserAuthenticated()
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  handleLoginSubmit(e){
    e.preventDefault()
    fetch("/api/web/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    //handle errors here
    .then(res => res.json())
    .then(res => {
      const token = res.user.auth_token
      if(token){
        Auth.authenticateToken(token)
        this.setState({
          authenticated: Auth.isUserAuthenticated(),
          loginEmail: "",
          userLoggedIn: res.user,
          loginPassword: ""
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  handleInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  render(){
    return (
      <Router>
        <div className="App">
          <Nav logoutUser={this.logoutUser} />
          <Route exact path="/" component={LandingPage} />
          <Route
            path="/login"
            render={() =>
              <LoginPage
                auth={this.state.authenticated}
                handleLoginSubmit={(e) => this.handleLoginSubmit(e)}
                loginEmail={this.state.loginEmail}
                loginPassword={this.state.loginPassword}
                handleInputChange={(e) => this.handleInputChange(e)}
                forgotPassword={(e) => this.forgotPassword(e)}
                showForgotPasswordMessage={this.state.showForgotPasswordMessage}
              />
          }/>
          <Route
            path="/sign-up"
            render={() =>
              <SignUpPage
                auth={this.state.authenticated}
                handleSignUp={(e) => this.handleSignUp(e)}
                registerEmail={this.state.registerEmail}
                registerPassword={this.state.registerPassword}
                handleInputChange={(e) => this.handleInputChange(e)}
              />
          }/>
          <Route path="/terms" exact component={TermsPage} />
          <Route path="/privacy" exact component={PrivacyPage} />
          <Route path="/catalog" exact component={CatalogPage} />
          <Route
            path="/account"
            render={() =>
              <AccountPage
                userLoggedIn={this.state.userLoggedIn}
              />
          }/>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
