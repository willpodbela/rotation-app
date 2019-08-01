import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fab } from "@fortawesome/free-brands-svg-icons"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import Nav from "./Nav"
import Footer from "./Footer"

library.add(fab)

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/signup" exact component={SignUpPage} />
        <Footer />
      </div>
    </Router>
  )
}

export default App
