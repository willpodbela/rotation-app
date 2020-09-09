import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import AuthPage from "./AuthPage"
import LoginPane from "./LoginPane"
import SignUpPane from "./SignUpPane"
import TermsPage from "./TermsPage"
import PrivacyPage from "./PrivacyPage"
import CatalogPage from "./CatalogPage"
import AccountPage from "./AccountPage"
import ItemDetailPage from "./ItemDetailPage"
import FaqPage from "./FAQPage"
import Nav from "./Nav"
import Footer from "./Footer"
import Auth from "./modules/Auth"
import AlertDialog from "./AlertDialog"

import login_img from "./img/login.jpg"
import signup_img from "./img/sign-up.jpg"

import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
library.add(fab, fas)

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      authenticated: Auth.isUserAuthenticated(),
      userLoggedIn: null,
      isLoading: false,
      error: null,
      notice: null,
      appFailed: false
    }
    if(this.state.authenticated && !this.state.userLoggedIn){
      this.state.isLoading = true
      this.getUser()
    }
    
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let campaign = params.get('campaign');
    if(campaign) {
      sessionStorage.setItem('advertisementCode', campaign)
    }
    
    window.overrideAuthToken = this.overrideAuthToken.bind(this)
    
    this.getUser = this.getUser.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  logoutUser(e){
    fetch("/api/web/auth/logout", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    })
    Auth.deauthenticateUser()
    
    // Reset User Identification for for analytics purposes
    window.analytics.reset()
    
    this.setState({
      authenticated: Auth.isUserAuthenticated()
    })
  }

  forgotPassword(e, email){
    e.preventDefault()
    
    if (email === "") {
      this.showError({message: "Please enter your email address in the login form and click again."})
    } else {
      fetch("/api/web/auth/forgot", {
        method: "POST",
        body: JSON.stringify({
          email: email
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => this.apiResponseHandler(res, "We've sent instructions to your email on resetting your password."))  
    }
  }

  handleSignUp(e, email, password, confirm, redirect){
    e.preventDefault()
    if(password !== confirm){
      this.showError({message: "Passwords don't match."})
    }else{
      fetch("/api/web/users", {
        method: "POST",
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => this.apiResponseHandler(res)).then(res => {
        const token = res.user.auth_token
        if(token){
          Auth.authenticateToken(token)
          this.setState({
            authenticated: Auth.isUserAuthenticated(),
            userLoggedIn: res.user,
            isLoading: false
          })
          this.updateUserWithAdvertisementCodeIfNeeded()
          // Mixpanel-required Alias pairing
          window.analytics.alias(res.user.id)

          // Identify User after sign up
          window.analytics.identify(res.user.id, {
            email: res.user.email
          });
          window.analytics.track('Sign Up', {
            email: res.user.email
          });
          
          if(redirect) {
            window.location.replace(redirect)
          } else {
            window.location.reload(true)
          }
        }
      })
    }
  }
  
  overrideAuthToken(token) {
    Auth.authenticateToken(token)
    window.location.reload(true)
  }
  
  // This function is called when an authentication token is still in the session storage,
  // but the userLoggedIn object is null and must be refreshed. Most likely the browser
  // window was reloaded.
  getUser(){
    fetch("/api/web/users/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${Auth.getToken()}`
      }
    }).then(res => this.apiResponseHandler(res)).then(res => {
      this.setState({
        userLoggedIn: res.user,
        isLoading: false
      })
      this.updateUserWithAdvertisementCodeIfNeeded()
      
      // Even though we most likely identified the user on log in or sign up (when auth 
      // token in session storage), we call identify again here to re-inform any stateless 
      // destinations of the users identify (such as Intercom).
      // The call is wrapped in analytics.ready to prevent race condition and ensure all
      // destinations have loaded.
      window.analytics.ready(function() {
        window.analytics.identify(res.user.id, {
          email: res.user.email
        });
      })
    }).catch(res => {
      this.setState({
        appFailed: true
      })
    })

  }

  handleLoginSubmit(e, email, password){
    e.preventDefault()
    fetch("/api/web/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => this.apiResponseHandler(res)).then(res => {
      const token = res.user.auth_token
      if(token){
        Auth.authenticateToken(token)
        this.setState({
          authenticated: Auth.isUserAuthenticated(),
          userLoggedIn: res.user,
          isLoading: false
        })
        this.updateUserWithAdvertisementCodeIfNeeded()
        
        // Identify User after log in
        let qty = null
        if(res.user.subscription) {
          qty = res.user.subscription.item_qty
        }
        window.analytics.identify(res.user.id, {
          email: res.user.email,
          plan: qty
        });
        window.analytics.track("Signed In")
        
        window.location.reload(true)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  
  updateUserWithAdvertisementCodeIfNeeded() {
    let adCode = sessionStorage.getItem('advertisementCode');
    if(this.state.authenticated && this.state.userLoggedIn && adCode) {
      fetch(`/api/web/users/${this.state.userLoggedIn.id}`, {
        method: "PUT",
        body: JSON.stringify({
            advertisement_code: adCode
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Auth.getToken()}`
        }
      }).then(res => {
        sessionStorage.removeItem('advertisementCode');
      })
    }
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

  showError(error){
    this.setState({error: error})
    this.setState({notice: null})
    window.analytics.track("Error Displayed", {
      error_message: error
    })
  }

  showNotice(notice){
    this.setState({error: null})
    this.setState({notice: notice})
    window.analytics.track("Notice Displayed", {
      message: notice
    })
  }

  apiResponseHandler(response, successMessage = null){
    if (response.ok) {
      if(successMessage) {
        this.showNotice({message: successMessage})
      }
      return response.json();
    } else if (response.status === 450) {
      // Invalid authentication token
      this.logoutUser()
      return Promise.reject('server returned non-2xx')
    } else {
      return response.json().then(response => {
        if (response && response.error && response.error.message) {
          this.showError(response.error)
        } else {
          this.showError({message: "A network error occurred. Please try again later." })
        }
        return Promise.reject('server returned non-2xx')
      })
    }
  }

  render(){
    if (this.state.appFailed) {
      return (
        <div className="middle_screen text_center">
          <div className="rotation_gray druk_large">The Rotation</div>
          <div className="rotation_gray proxima_large">Our server is currently down for maintenance. Please come back later.</div>
        </div>
      )
    } else if (this.state.isLoading) {
      return (
        <div className="middle_screen text_center">
          <div className="rotation_gray druk_large">The Rotation</div>
          <div className="rotation_gray proxima_large">Loading...</div>
        </div>
      )
    } else {
      return (
        <Router>
          <div className="App">
            <Nav logoutUser={(e) => this.logoutUser(e)} />
            <AlertDialog error={this.state.error} notice={this.state.notice} onClose={() => this.dialogClosed()} />
            <Switch>
              <Route
                exact path="/login"
                render={() =>
                  <AuthPage
                    auth={this.state.authenticated}
                    pageTitle={"Log In"}
                    image={login_img}
                    authPane={
                      <LoginPane
                        handleLoginSubmit={(e, email, pass) => this.handleLoginSubmit(e, email, pass)}
                        forgotPassword={(e, email) => this.forgotPassword(e, email)}
                        handleSignUpClicked={(e) => window.location.replace("/sign-up")}
                      />
                    }
                  />
              }/>
              <Route
                exact path="/sign-up"
                render={() =>
                  <AuthPage
                    auth={this.state.authenticated}
                    pageTitle={"Sign Up"}
                    image={signup_img}
                    authPane={
                      <SignUpPane
                        handleSignUp={(e, email, pass, confirm) => this.handleSignUp(e, email, pass, confirm)}
                        handleLogInClicked={(e) => window.location.replace("/login")}
                      />
                    }
                  />
              }/>
              <Route
                exact path="/catalog"
                render={() =>
                  <CatalogPage
                    auth={this.state.authenticated}
                    handleSignUp={this.handleSignUp}
                    handleLoginSubmit={(e, email, pass) => this.handleLoginSubmit(e, email, pass)}
                    forgotPassword={(e) => this.forgotPassword(e)}
                    errorHandler={(error) => this.showError(error)}
                    noticeHandler={(notice) => this.showNotice(notice)}
                    apiResponseHandler={(res, successMessage) => this.apiResponseHandler(res, successMessage)}
                    userLoggedIn={this.state.userLoggedIn}
                    getUser={this.getUser}
                  />
              }/>
              <Route
                exact path="/account"
                render={() =>
                  <AccountPage
                    auth={this.state.authenticated}
                    userLoggedIn={this.state.userLoggedIn}
                    errorHandler={(error) => this.showError(error)}
                    noticeHandler={(notice) => this.showNotice(notice)}
                    apiResponseHandler={(res, successMessage) => this.apiResponseHandler(res, successMessage)}
                  />
              }/>
              <Route
                path="/catalog/:itemInfo"
                render={(props) =>
                  <ItemDetailPage
                    {...props}
                    auth={this.state.authenticated}
                    userLoggedIn={this.state.userLoggedIn}
                    errorHandler={(error) => this.showError(error)}
                    noticeHandler={(notice) => this.showNotice(notice)}
                    apiResponseHandler={(res, successMessage) => this.apiResponseHandler(res, successMessage)}
                    handleSignUp={(e, email, pass, confirm) => this.handleSignUp(e, email, pass, confirm)}
                    handleLoginSubmit={(e, email, pass) => this.handleLoginSubmit(e, email, pass)}
                    forgotPassword={(e, email) => this.forgotPassword(e, email)}
                  />
              }/>
              <Route path="/terms" exact component={TermsPage} />
              <Route path="/privacy" exact component={PrivacyPage} />
              <Route path="/faq" exact component={FaqPage} />
              <Route 
                path="/*" 
                component={(props) => {
                  window.location.href = 'https://join.therotation.club'; 
                  return null;      
                }       
              }/>
            </Switch>
            <Footer />
          </div>
        </Router>
      )
    }
  }
}

export default App
