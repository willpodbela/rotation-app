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
import AlertDialog from "./AlertDialog"

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
      registerConfirmPassword: "",
      userLoggedIn: null,
      isLoading: false,
      error: null,
      notice: null,
    }
    if(this.state.authenticated && !this.state.userLoggedIn){
      this.state.isLoading = true
      this.getUser()
    }
  }

  logoutUser(e){
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
      window.location.reload(true)
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
      this.handleNotice({message: "We've sent instructions to your email on resetting your password."})
    })
  }

  handleSignUp(e){
    e.preventDefault()
    if(this.state.registerPassword !== this.state.registerConfirmPassword){
      console.log("Passwords don't match.")
    }else{
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
            authenticated: Auth.isUserAuthenticated(),
            isLoading: false
          })
          window.location.reload(true)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  getUser(){
    fetch("api/web/users/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => res.json()).then(res => {
      this.setState({
        userLoggedIn: res.user,
        isLoading: false
      })
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
          loginPassword: "",
          isLoading: false
        })
        window.location.reload(true)
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
  
  dialogClosed(){
    this.setState({error: null})
    this.setState({notice: null})
  }
  
  handleError(error){
    this.setState({error: error})
  }
  
  handleNotice(notice){
    this.setState({notice: notice})
  }

  render(){
    if (this.state.isLoading) {
      return (
        <span>The application is loading... (TODO: Make it look nice)</span>
      )
    } else {
      return (
        <Router>
          <div className="App">
            <Nav logoutUser={(e) => this.logoutUser(e)} />
            <AlertDialog error={this.state.error} notice={this.state.notice} onClose={() => this.dialogClosed()} />
            <Route
              exact path="/"
              render={() =>
                <LandingPage
                  auth={this.state.authenticated}
                />
            }/>
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
                  errorHandler={(error) => this.handleError(error)}
                  noticeHandler={(notice) => this.handleNotice(notice)}
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
                  registerConfirmPassword={this.state.registerConfirmPassword}
                  handleInputChange={(e) => this.handleInputChange(e)}
                  errorHandler={(error) => this.handleError(error)}
                  noticeHandler={(notice) => this.handleNotice(notice)}
                />
            }/>
            <Route
              path="/catalog"
              render={() =>
                <CatalogPage
                  auth={this.state.authenticated}
                  handleSignUp={(e) => this.handleSignUp(e)}
                  handleLoginSubmit={(e) => this.handleLoginSubmit(e)}
                  forgotPassword={(e) => this.forgotPassword(e)}
                  showForgotPasswordMessage={this.state.showForgotPasswordMessage}
                  loginEmail={this.state.loginEmail}
                  loginPassword={this.state.loginPassword}
                  handleInputChange={(e) => this.handleInputChange(e)}
                  registerEmail={this.state.registerEmail}
                  registerPassword={this.state.registerPassword}
                  registerConfirmPassword={this.state.registerConfirmPassword}
                  errorHandler={(error) => this.handleError(error)}
                  noticeHandler={(notice) => this.handleNotice(notice)}
                  userLoggedIn={this.state.userLoggedIn}
                />
            }/>
            <Route
              path="/account"
              render={() =>
                <AccountPage
                  userLoggedIn={this.state.userLoggedIn}
                  errorHandler={(error) => this.handleError(error)}
                  noticeHandler={(notice) => this.handleNotice(notice)}
                />
            }/>
            <Route path="/terms" exact component={TermsPage} />
            <Route path="/privacy" exact component={PrivacyPage} />
            <Footer />
          </div>
        </Router>
      )
    }
  }
}

export default App
