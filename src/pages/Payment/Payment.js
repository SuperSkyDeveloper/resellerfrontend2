import React, { Component } from 'react';
import { ToastContainer, toast} from 'react-toastify';
import AuthContext from '../../components/Context/Context';
import {Redirect} from 'react-router-dom';
import {Data} from '../../data';
import './Payment.css'

const usingurl = Data.alterData.using.url;

class Payment extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props); 
        this.state = {
          name:localStorage.getItem('username'),
          // price:typeof(this.props.location.state)==="undefined"?0:this.props.location.state.price,
          // credits:typeof(this.props.location.state)==="undefined"?0:this.props.location.state.credits,
          price:this.props.location.state.price,
          credits:this.props.location.state.credits
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
      paypal = () => {
        console.log("Start Payment");
        const token = this.context.token;
        const name = this. state.name;
        const price = +this. state.price;
        const credits = +this. state.credits;
        const requestBody = {
          query:`
              mutation Paypal($name: String!, $price: Float!, $credits: Float!) {
                  paypal(paypalInput: {name: $name, price: $price, credits: $credits}) {
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
          }
        };
        fetch(usingurl, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
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
      }

      testPaypal = () => {
        if(!this.state.price) {
          this.onToast("failed", "Something went wrong")
        } else {
          const requestOption = {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json'},
            body: JSON.stringify({ amount : this.state.price, })
          };
          fetch("http://localhost:8000/buy", requestOption)
          .then(res => res.json())
          .then(value => {
            console.log("value", value);
          });
        }
      };

  render() {  
    if (typeof(this.props.location.state)==="undefined") {
      return <Redirect to='/shop' />
    }
    // console.log("price", typeof(this.props.location.state));
    return (
        <>
        <ToastContainer />
        <div className="paypal-body">
            <div className="row">
              <div className="col-md-3"></div> 
                <div className="col-md-6">
                  <div className = "main-paypal">
                    <div className="row padder">
                      <div> 
                        <h2> By {this.state.credits} Credits </h2> 
                        <hr /> 
                        <b> Description: </b> <span className="description">Start earning money with more credits as reseller.  Allows you to start
                        selling as soon as you start  business. </span>
                        <hr /> 
                        <h2> Only for ${this.state.price} </h2>
                        <hr />
                          <button className="btn btn-warning btn-payment" onClick={this.testPaypal}> <i><span className="paypal-text-first">Pay</span></i><i><span className="paypal-text-second">Pal</span></i> </button>
                      </div> 
                    </div>
                  </div>
                </div>
                <div className="col-md-2"> 
              </div>
            </div>
        </div>
      </>
    )
  }
}

export default Payment;