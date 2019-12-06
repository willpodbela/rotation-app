import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import PrivacyPage from "./PrivacyPage"
import CatalogPage from "./CatalogPage"
import AccountPage from "./AccountPage"
import Nav from "./Nav"
import Footer from "./Footer"

library.add(fab, fas)

class App extends Component {
  render(){
    return (
      <Router>
        <div className="App">
          <Nav />
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/sign-up" exact component={SignUpPage} />
          <Route path="/privacy" exact component={PrivacyPage} />
          <Route path="/catalog" exact component={CatalogPage} />
          <Route path="/account" exact component={AccountPage} />
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
