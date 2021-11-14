import React, { Component } from 'react';
import banner from '../images/banner.jpg'


class Homepage extends Component {
  render() {
    return (
      <div className="home-main">
      <img src= {banner} width="70%" alt="Dream logo" />
      </div>
    )
  }
}

export default Homepage;