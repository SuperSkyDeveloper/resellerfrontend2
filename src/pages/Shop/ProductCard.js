
import React, { Component } from 'react';
import Context from '../../components/Context/Context';
import { NavLink } from 'react-router-dom';

// import Moment from 'react-moment';
import '../../App.css';

import PaypalCheckoutButton from './PaypalCheckoutButton';

class ProductCard extends Component {

    static contextType = Context;

    state = {
        order : {
            total: this.props.price,
            credits: this.props.credits,
            items: [
              {
                sku: '001',
                price: this.props.price,
                quantity: 1,
                currency: 'USD'
              }
            ]
          }
    }

    render() {
        return (
            <div className="card-container">
            <div className="desc">
                {(!this.context.token) ?
                    <p><b>Need Login to buy product</b></p> : <PaypalCheckoutButton order={this.state.order}/>
                }
            </div>
        </div>
        )
    }
}
   

export default ProductCard;