import React, { Component }  from "react"
import { Link } from "react-router-dom"
import Auth from "../modules/Auth"
import { Helmet } from "react-helmet";
import BannerImage from "../img/Rotation-Banner.jpg"

class RotationHelmet extends Component {
  render(){
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <title>{this.props.title || "The Rotation | Men's Rent the Runway for Streetwear & Designer"}</title>
        <meta name="description" content={this.props.desc || "The Rotation provides its members with exclusive access to a closet full of designer clothes &amp; streetwear. Our plans give you the ability to wear multiple styles at a time for as long as you want. Some people call us Rent the Runway for Men's Streetwear, but we believe our identity is in our style selection and curation, not gender lines."}></meta>
        <meta property="og:image" content={'therotation.club'+ BannerImage}></meta>
        <meta name="twitter:site" content="@therotation.club"></meta>
      </Helmet>
    )
  }
}
export default RotationHelmet