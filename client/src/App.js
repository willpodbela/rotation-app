import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { fas } from "@fortawesome/free-solid-svg-icons"
import LandingPage from "./LandingPage"
import NewLandingPage from "./NewLandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import StatusPage from "./StatusPage"
import PrivacyPage from "./PrivacyPage"
import Nav from "./Nav"
import NewNav from "./NewNav"
import Footer from "./Footer"

library.add(fab, fas)

class App extends Component {
  render(){
    return (
      <Router>
        <div className="App">
          <NewNav />
          <Route exact path="/" component={NewLandingPage} />
          <Route path="/login" exact component={LoginPage} />
          <Route path="/signup" exact component={SignUpPage} />
          <Route path="/status" exact component={StatusPage} />
          <Route path="/privacy" exact component={PrivacyPage} />
          {/* <Footer /> */}
        </div>
      </Router>
    )
  }
}

export default App
