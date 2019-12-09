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
import PrelauncherPage from "./PrelauncherPage"
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
      email: "",
      password: "",
      user: {}
    }
  }

  logoutUser(){
    fetch("/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    //handle errors here
    .then(res => {
      Auth.deauthenticateUser()
      console.log(Auth.isUserAuthenticated())
      this.setState({
        authenticated: Auth.isUserAuthenticated(),
        user: {}
      })
    })
  }
  
  handleLoginSubmit(e){
    e.preventDefault()
    fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
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
          user: res.user
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
                email={this.state.email}
                password={this.state.password}
                handleInputChange={(e) => this.handleInputChange(e)}
              />
          }/>
          <Route path="/sign-up" exact component={SignUpPage} />
          <Route path="/terms" exact component={TermsPage} />
          <Route path="/privacy" exact component={PrivacyPage} />
          <Route path="/catalog" exact component={CatalogPage} />
          <Route path="/account" exact component={AccountPage} />
          <Route path="/prelauncher" exact component={PrelauncherPage} />
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
