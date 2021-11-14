import React, { Component } from 'react';

class About extends Component {
  render() {
    console.log("data", this.props.location.state);
    
    return (
      <h1>About</h1>
    )
  }
}

export default About;