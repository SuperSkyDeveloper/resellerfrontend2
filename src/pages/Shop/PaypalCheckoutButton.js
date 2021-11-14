import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';
import Context from '../../components/Context/Context';
import {url} from '../../url';

const usingurl = url.local;


class PaypalCheckoutButton extends Component {

    state = {
        order: this.props.order,
        paypalConf : { 
            currency: 'USD',
            env: 'sandbox',
            client: {
              sandbox: "AQcqg9ychDyLm6y2VXfkrE828zPKMlmMQa6HpGHev3hT3Xv9cKeNAHc1DeKOoM8ex1-ZiDz4bMN1fCJ4",
              production: '--',
            },
            style: {
              label: 'pay',
              size: 'responsive', // small | medium | large | responsive
              shape: 'rect',   // pill | rect
              color: 'gold',  // gold | blue | silver | black
            }
          }
    }

    static contextType = Context;


    addCredits = event =>{
        // event.preventDefault();
        const resellerName = localStorage.getItem('username');
        const credits = this.state.order.credits; 
      
        let requestBody = {
          query: `
            mutation AddCredits($resellerName: String!, $credits: Float!) {
              addCredits(resellerName: $resellerName, credits: $credits) {
                credits
              }
            }
          `,
          variables: {
            resellerName: resellerName,
            credits: credits
          }
        };
      
        const token = this.context.token;
      
        fetch(usingurl, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        })
        .then(res => {
          // console.log("res", res);
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
            console.log("resData",resData);
          // this.fetchCredits();
        //   this.setState({resellerCredits:resData.data.addCredits.credits});
        //   this.onToast("success", "Credits added Successfully");
        //   this.setState({addingCredits:false});     
        })
        .catch(err => {
        //   this.onToast("failed", "Something went wrong");
        //   this.setState({creating:false});
          console.log(err);
        });
        
        };
    payment = (data, actions) => {
        const payment = {
          transactions: [
            {
              amount: {
                total: this.state.order.total,
                currency: this.state.paypalConf.currency,
              },
              description: 'product description',
              custom: this. state.order.customer || '',
              item_list: {
                items: this.state.order.items
              },
            },
          ],
          note_to_payer: 'testing mood note',
        };
    
        // console.log(payment);
        return actions.payment.create({
          payment,
        });
      };
    
      onAuthorize = (data, actions) => {
        return actions.payment.execute()
          .then(response => {
            // console.log("respnse",response);
            alert(`Payment Success!`);
            this.addCredits();
          })
          .catch(error => {
            console.log(error);
              alert('alert error!');
          });
      };
    
      onError = (error) => {
        alert ('an error occured and payment declined!' );
      };
    
      onCancel = (data, actions) => {
        alert( 'Payment canceled!' );
      };
    render() {
        const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });
        return (
            <PayPalButton
                env={this.state.paypalConf.env}
                client={this.state.paypalConf.client}
                payment={(data, actions) => this.payment(data, actions)}
                onAuthorize={(data, actions) => this.onAuthorize(data, actions)}
                onCancel={(data, actions) => this.onCancel(data, actions)}
                onError={(error) => this.onError(error)}
                style={this.state.paypalConf.style}
                commit
                locale="en_US"
            />
        )
    }

}

 
    



export default PaypalCheckoutButton;
