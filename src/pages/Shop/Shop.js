import React from 'react';
import ProductCard from './ProductCard';
import './Shop.css';
//Importing bootstrap and other modules
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Data }  from '../../data'
import { Link } from 'react-router-dom';
import AuthContext from '../../components/Context/Context';

class Shop extends React.Component {
  static contextType = AuthContext;
  render() {
      
   const data = Data.pricingTable;
    return (
     
      <div className="maincontainer">
       <section>
          <div class="container py-5">            
            <header class="text-center mb-5 text-white">
              <div class="row">
                <div class="col-lg-8 mx-auto">
                  <h1>Please select one of the table to buy credits!</h1>
                  <p>Easily make money as seller.<br /> <h1>SELLER PANEL</h1></p>
                </div>
              </div>
            </header>
            <div class="row text-center align-items-end">
            {data.map((row) => {
              return <div class="col-lg-3 mb-5 mb-lg-0">
              <div key={row.id} class="bg-white p-5 rounded-lg shadow">
                
                <h2 class="h3 font-weight-bold">{row.credits} credits = <br/>${row.price}</h2>

                <div class="custom-separator my-4 mx-auto bg-primary"></div>

                <ul class="list-unstyled my-5 text-small text-left">
                  <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 1 Year Activation: 12 Credits</li>
                  <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 6 Month Activation: 6 Credits</li>
                  <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 3 Month Activation: 3 Credits</li>
                    <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 1 Month Activation: 1 Credits</li>
                    <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 24/7 Support</li>
                    <li class="mb-5">
                    <i class="fa fa-check mr-2 text-primary"></i> 0% Extra</li>
                </ul>
                {/* <button class="btn-price">Buy Now</button> */}
                
                {/* <Link to= {
                  {
                    pathname: '/payment',
                    state: {credits: row.credits, price: row.price}
                  }
                }>Buy now</Link> */}
                <ProductCard 
                  key={row.id}
                  price = {row.price}
                  credits = {row.credits}
                  />
              </div>
            </div>
            })}

              {/* <div class="col-lg-3">
                <div class="bg-white p-5 rounded-lg shadow">
                  <h1 class="h6 text-uppercase font-weight-bold mb-4">Enterprise</h1>
                  <h2 class="h1 font-weight-bold">$899<span class="text-small font-weight-normal ml-2">/ month</span></h2>

                  <div class="custom-separator my-4 mx-auto bg-primary"></div>

                  <ul class="list-unstyled my-5 text-small text-left font-weight-normal">
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> Lorem ipsum dolor sit amet</li>
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> At vero eos et accusamus</li>
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> Nam libero tempore</li>
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                    <li class="mb-3">
                      <i class="fa fa-check mr-2 text-primary"></i> Sed ut perspiciatis</li>
                  </ul>
                  <a href="#" class="btn btn-primary btn-block  shadow rounded-pill">Buy Now</a>
                </div>
              </div> */}             

            </div>
          </div>
        </section>

      </div>      
)
};
}

export default Shop;