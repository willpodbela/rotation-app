import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import "bootstrap/dist/css/bootstrap.min.css"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import StatusPage from "./StatusPage"
import PrivacyPage from "./PrivacyPage"
import InviteFriendsPage from "./InviteFriendsPage"
import BrowseCatalogPage from "./BrowseCatalogPage"
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
          <Route path="/signup" exact component={SignUpPage} />
          <Route path="/status" exact component={StatusPage} />
          <Route path="/privacy" exact component={PrivacyPage} />
          <Route path="/invite" exact component={InviteFriendsPage} />
          <Route path="/catalog" exact component={BrowseCatalogPage} />
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
