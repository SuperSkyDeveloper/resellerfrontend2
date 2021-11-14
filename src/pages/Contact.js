import React, { Component } from 'react';

import './Contact.css';

class Contact extends Component {
  render() {
    return (
      <div className="contact-body">
        <h1>CONTACT US</h1>
        <div className="contact-element">
          <p>Email: </p>  
          <a href="mailto:digitalhub@outlook.com">digitalhub@outlook.com</a>
        </div>
        <div className="contact-element">
          <p>Phone Number: </p>
          <a href="tel:+16479512049">+1 647 9512049</a>
        </div>
    </div>
    )
  }
}

export default Contact;