import React, { Component } from "react"
import BannerImage from "../img/Rotation-Banner.jpg"
import { Helmet } from "react-helmet";
import RotationHelmet from "../RotationHelmet";

class TermsPage extends Component {
  componentDidMount(){
    window.analytics.page("Terms"); // Name of this page view for analytics purposes
    window.scrollTo(0, 0)
  }

  render(){
    return (
      <div className="TermsPage gray_border_top proxima">
        <RotationHelmet title="Terms of Service | The Rotation" />
        <section className="padding_top25 padding_bottom80 sides13pct">
        	<div>
        		<h2 className="font42 font_second light rotation_gray bottom20">Terms of Service</h2>
        		<div className="top10 font18 light rotation_gray">
              The following Terms of Service ("Terms") between you ("you", "your") and Rotation Inc. ("us", "we", "our", or "The Rotation") describes the terms and conditions on which you may access and use The Rotation at http://www.therotation.club, or The Rotation iOS or Android mobile Apps ("App","Apps") (collectively, the "Site"). The Rotation offers a Service ("Service", "Services") that allows you to rent clothing and accessories ("Products"), with the option to purchase the Products you rent. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
            </div>
            <div className="top10 font18 light rotation_gray uppercase">
              Please read these terms carefully. These terms may have changed since you last accessed or used the services. By accessing or using any part of the services, you agree to these terms.
            </div>
        		<h2 className="font22 light title padding_top20">About the Services</h2>
        		<div className="top10 font18 light rotation_gray">
              By using this Site, you represent, acknowledge and agree that you are at least 18 years of age, or if you are under 18 years of age but are at least 13 years old (a "Minor"), that you are using the Site with the consent of your parent or legal guardian and that you have received your parent’s or legal guardian’s permission to use the Site and agree to its Terms. If you are a parent or legal guardian of a Minor, you hereby agree to bind the Minor to these Terms and to fully indemnify and hold harmless The Rotation if the Minor breaches any of these Terms. If you are not at least 13 years old, you may not use the Site at any time or in any manner or submit any information to The Rotation or the Site.
            </div>
            <div className="top10 font18 light rotation_gray">
              You further agree to maintain the strict confidentiality of your account issued to you for your use of or access to the Services or any portion thereof, and you agree not to allow any other person or entity to use any username(s) that are issued to you. You shall be responsible for all activity that occurs under your account. We cannot and will not be liable for any loss or damage arising from your failure to comply with these obligations.
            </div>
            <h2 className="font22 light title padding_top20">Communications</h2>
        		<div className="top10 font18 light rotation_gray">
              You consent to receive communications from us, including email, text messages, calls, and push notifications, including for the purposes of notifying you about the status of your order, sending you reminders, facilitating secondary authentication, and providing other information. We may contact you by telephone calls or text messages, including by an automatic telephone dialing system, at any of the telephone numbers provided by you. Standard message and data rates charged by your mobile carrier may apply to the text messages we send you. You may opt out of receiving text messages by notifying The Rotation at support@therotation.club. We may contact you by telephone if we have questions about your Subscription ("Subscription"). These communications are part of your relationship with The Rotation. You agree that any notices, agreements, disclosures or other communications that we send you electronically will satisfy any legal communication requirements, including that such communications be in writing.
            </div>
            <h2 className="font22 light title padding_top20">Modifications of the Services or Terms</h2>
            <div className="top10 font18 light rotation_gray">
              The Rotation is a beta program, we may modify these Terms or modify, suspend, or discontinue the Services at any time for any reason. However, The Rotation will use commercially reasonable efforts to notify you of material changes to these Terms by posting a notice on the Site and/or sending an email to the email address you provided to The Rotation upon registration.
            </div>
            <h2 className="font22 light title padding_top20">Program Information</h2>
            <div className="top10 font18 light rotation_gray">
              Customers who subscribe to the Services will be able to have two, three, or four garments they selected from The Rotation catalog ("Rotation") out at one time for a monthly fee of $89, $129, or $159, respectively, excluding any applicable taxes.
            </div>
            <h2 className="font22 light title padding_top20">Use of the Products</h2>
            <div className="top10 font18 light rotation_gray">
              You agree to treat the Products with great care, as if it was borrowed from a friend. You are responsible for loss, destruction or damage to the Products due to theft, mysterious disappearance, fire, major stains or any other cause, other than normal wear and tear. Normal wear and tear encompasses minor stains, rips, missing beads, stuck zippers or other minor damage covered by the insurance you paid for with your rental of the applicable Product. If you return a Product that is damaged beyond normal wear and tear, then you agree that we shall charge you, and you shall pay, for the price for repairing or replacing the Product, as determined in our discretion, up to the Retail Value for the Product.
            </div>
            <h2 className="font22 light title padding_top20">Changes to Subscription Pricing</h2>
            <div className="top10 font18 light rotation_gray">
              We reserve the right to change the Services, adjust pricing for the Services or any components thereof in any manner and at any time as we may determine in our sole and absolute discretion. If you do not like any change that we make, you may cancel your subscription. Any price changes or changes to your subscription will take effect following notice to you and your continued use of the service without cancelling shall be deemed acceptance of the change(s).
            </div>
            <h2 className="font22 light title padding_top20">Payment and Billing Cycle</h2>
            <div className="top10 font18 light rotation_gray">
              To use the Services, you must provide a valid debit or credit card (a "Payment Method"). The Rotation will not accept prepaid cards, such as gift cards or merchandise credit as payment. By providing a Payment Method, you authorize us to charge the monthly subscription fee to the Payment Method associated with your account. You remain responsible for any uncollected amounts. If a payment is not successfully settled, due to expiration, insufficient funds, or otherwise, and you do not cancel your account, we may suspend your access to the Services until we have successfully charged a valid Payment Method. You can update your Payment Method anytime by reaching out to the Customer Support team at support@therotation.club. We also may update your Payment Method using information provided by payment services providers, such as a new expiration date or credit card number. Following any update, you authorize us to continue to charge the applicable Payment Method.
            </div>
            <h2 className="font22 light title padding_top20">Cancellation</h2>
            <div className="top10 font18 light rotation_gray">
              Your Subscription will continue monthly and automatically renew approximately every 30 days unless cancelled. The date and time you enroll becomes your "Anniversary" for purposes of your billing cycle, meaning that your Payment Method will be charged on or around that day unless you cancel by that day. We do not provide refunds or credits for any partial Subscription periods.
            </div>
            <h2 className="font22 light title padding_top20">Collections</h2>
            <div className="top10 font18 light rotation_gray">
              If you do not pay the amounts you owe to The Rotation when due, then The Rotation will need to institute collection procedures. You agree to pay The Rotation’s costs of collection, including without limitation reasonable attorneys' fees.
            </div>
            <h2 className="font22 light title padding_top20">No Refunds</h2>
            <div className="top10 font18 light rotation_gray">
              Payments are nonrefundable. Following any cancellation, however, you will continue to have access to the Services through the end of your current billing period.
            </div>
            <h2 className="font22 light title padding_top20">Holding Period</h2>
            <div className="top10 font18 light rotation_gray">
              You may keep your Rotation and Products for as long as you like. However, you will not be eligible for your next Rotation until you have returned or purchased all of the items in your last Rotation. Products will be considered returned when we receive them in undamaged condition (the "Return Date"). If you return some but not all Products, we reserve the right to assume that you have chosen to purchase any Products that we did not receive by the Return Date, and we may charge your Payment Method for those Products any time after the Return Date. In the event of damage upon receipt, you must reach out to the Customer Support team within 48 hours of receiving your Rotation at support@therotation.club.
            </div>
            <h2 className="font22 light title padding_top20">Returns</h2>
            <div className="top10 font18 light rotation_gray">
              With each shipment of Products we send you, we will include one return packaging, which you will use to return all of the Products from that Rotation that you have chosen not to purchase. Costs of returning will be covered by the Company with the provided return packaging and label. Returning via alternative shipping methods will not be covered by the Company.
            </div>
            <h2 className="font22 light title padding_top20">Title and Risk of Loss</h2>
            <div className="top10 font18 light rotation_gray">
              Title to each Product in your Rotation remains with us while you have a Product at home until you purchase the Product. If you elect to purchase a Product or Products in your Rotation, title to those products in your Rotation will pass to you when we successfully charge you the Product’s purchase price. Risk of loss passes to you upon delivery of your Rotation to a common carrier. For returns from you to us, risk of loss passes to us upon our receipt of your returned Box from a common carrier.
            </div>
            <h2 className="font22 light title padding_top20">Indemnification</h2>
            <div className="top10 font18 light rotation_gray">
              You agree to indemnify, defend, and hold harmless The Rotation, its officers, directors, employees, agents, licensors and suppliers (collectively the "Service Providers") from and against all losses, expenses, damages and costs, including reasonable attorney’s fees, resulting from any violation of these Terms or any activity related to your Subscription (including negligent or wrongful conduct) by you or any other person accessing the Site using your account.
            </div>
            <h2 className="font22 light title padding_top20">Contact Information</h2>
            <div className="top10 font18 light rotation_gray">
              The Rotation welcomes your questions or comments regarding these Terms of Service. If you believe that The Rotation has not adhered to these Terms, please contact Rotation at support@therotation.club.
            </div>
            <div className="top10 font18 light rotation_gray">
              Effective as of October 10, 2019
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default TermsPage
