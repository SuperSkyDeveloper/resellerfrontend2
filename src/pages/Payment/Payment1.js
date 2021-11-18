//Stripe integration
import React, { Component } from 'react';
import StripeCheckout from "react-stripe-checkout";
import { ToastContainer, toast} from 'react-toastify';
import AuthContext from '../../components/Context/Context';
import {Data} from '../../data';
import './Payment.css'

const usingurl = Data.alterData.using.url;

class Payment extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props); 
        this.state = {
          product: {
          name:localStorage.getItem('username'),
          price:this.props.location.state.price,
          credits:this.props.location.state.credits,
          productBy: "GameRoom"
          }
        }
      }
      onToast = (type, content) => {
        switch (type) {
          case "success":
            toast.success(content);
            break;
          case "failed":
            toast.error(content);
            break;
          default:
            break;
        }
      }
      makePayment = (info) => {

        const token1 = this.context.token;
        const name = this. state.product.name;
        const price = +this. state.product.price;
        const credits = +this. state.product.credits;
        const infoEmail = info.email;
        const infoId = info.id;
        const infoCard = info.card.name;
        const infoCountry = info.card.address_country;        

        const requestBody = {
          query:`
              mutation Payment($infoCountry: String!, $infoCard: String! $name: String!, $price: Float!, $credits: Float!, $infoEmail: String!, $infoId: String!) {
                  payment(paymentInput: { infoCountry: $infoCountry, infoCard: $infoCard, name: $name, price: $price, credits: $credits, infoEmail: $infoEmail, infoId: $infoId}) {
                      _id
                      resellerName
                      credits
                      price
                      createdAt

                      
                  }
              }
          `,
          variables: {
              name: name,
              price: price,
              credits: credits,
              infoEmail: infoEmail,
              infoId: infoId,
              infoCard: infoCard,
              infoCountry: infoCountry
          }
      };
      
      fetch(usingurl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token1
        }
      })
      .then(res => {
        console.log("responsse", res);
        
        if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log("resData", resData);
        
      })
      .catch(err => {
        console.log(err);
      }); 

      };
  render() {  
    return (
        <>
        <ToastContainer />
        <div className="payment-body">
            <div className="payment-first-form">
                <h1>{this.props.location.state.credits} Credits</h1>
                <StripeCheckout stripeKey="pk_test_51IX4LRIlu8nUagSXP2UeL5ogUA3XWhPHiTp6acnTeeXWXP5He0wfVSKxjnwfHFquJmC0hNPXaFgArvCCFBIoxmQu00sy7XBdsN"
                token={this.makePayment} 
                name="Buy Credits"
                amount={this.props.location.state.price*100}
                shippingAddress
                billingAddress 
                >
                <button className="btn-payment">Buy Credits with  {this.props.location.state.price}$</button>
                </StripeCheckout>
            </div>
      </div>
      </>
    )
  }
}

export default Payment;