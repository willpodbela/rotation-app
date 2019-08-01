import React, { Component } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import LandingPage from "./LandingPage"
import LoginPage from "./LoginPage"
import SignUpPage from "./SignUpPage"
import Nav from "./Nav"
import Footer from "./Footer"

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
