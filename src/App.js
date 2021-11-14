import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Homepage from './pages/Homepage';
import AuthContext from './components/Context/Context';

import './App.css';
import Login from './pages/Login/Login';
// import Contact from './pages/Contact';
// import About from './pages/About';
import Footer from './components/Footer/Footer';
import Reseller from './pages/Reseller/Reseller';
import Admin from './pages/Admin/Admin';
import Shop from './pages/Shop/Shop';
import Payment from './pages/Payment/Payment';

// const token = localStorage.getItem('token');
// const resellerId = localStorage.getItem('resellerId');
// localStorage.removeItem('token','resellerId');
class App extends Component {

  state = {
    token: null,
    resellerId: null,
    username: null,
  };
  
  componentDidMount() {
    this.onSetToken();
  }

  onSetToken = () => {
    this.setState({
      token: localStorage.getItem('token'), 
      resellerId: localStorage.getItem('resellerId'),
      username: localStorage.getItem('username')
    })
  }

  login = (token, resellerId, username) => {
    this.setState({token: token, resellerId: resellerId, username: username});
  };
  logout = () => {
    this.setState({ token: null, resellerId: null, username: null });
    localStorage.removeItem('token');
    localStorage.removeItem('resellerId');
    localStorage.removeItem('username');
    localStorage.removeItem('credits');

  };
  

  render() {
    // console.log(localStorage.getItem('username'));
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value = {{
              token: this.state.token,
              resellerId: this.state.resellerId,
              login: this.login,
              logout: this.logout
            }}
          >
          <Navigation username={this.state.username}/>
          <main className="main-content">
            <Switch>
              {this.state.token && (
                <Redirect from="/login" to="/account" exact />
              )}
               {this.state.token && (
                 (this.state.resellerId === "616c5a56d4b61b864bfc72c7")? <Route path="/account" component={Admin} />:<Route path="/account" component={Reseller}/>
              )} 
              {/* <Route path="/account" component={Account} /> */}
              {!this.state.token && (
                <Route path="/login" component={Login} />
              )}
              {!this.state.token && (
                <Redirect from="/payment" to="/login" exact />
              )}
              {!this.state.token && (
                <Redirect from="/account" to="/login" exact />
              )} 
              {!this.state.token && (
                <Redirect from="/payment" to="/login" exact />
              )}   
              <Route path="/payment" component={Payment} />          
              <Route path="/home" component={Homepage} /> 
              <Route path="/shop" component={Shop} /> 
              <Redirect from="/" to="/home" exact /> 
                         
            </Switch>
          </main>
          <Footer/>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App;
