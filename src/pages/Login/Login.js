import React, { Component } from 'react';
import Context from '../../components/Context/Context';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {url} from '../../url';

import './Login.css';
import Spinner from '../../components/Spinner/Spinner';

const usingurl = url.local;

class Login extends Component {

  state = {
    isLoading: false
  }

  static  contextType = Context;

  constructor(props) {
    super(props);
    this.usernameEl = React.createRef();
    this.passwordEl = React.createRef();
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

  submitHandler = event =>{
    this.setState({ isLoading: true });
    event.preventDefault();
    const username = this.usernameEl.current.value;
    const password = this.passwordEl.current.value;

    if (username.trim().length === 0 || password.trim().length === 0) {
      this.onToast("failed", "Please fill all the forms");
      this.setState({ isLoading: false });
      return;
    }
    const requestBody = {
      query:`
        query Login($username: String!, $password: String!) {
          login(username:$username, password: $password) {
            resellerId
            token
          }
        }
      `,
      variables: {
        username: username,
        password: password
      }
    };
    fetch(usingurl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({ isLoading: false });
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if(resData.data.login.resellerId === "1") {
          this.onToast("failed", "User does not exist");
          this.setState({ isLoading: false });
          return;
        }
        if(resData.data.login.resellerId === "2") {
          this.setState({ isLoading: false });
          this.onToast("failed", "Incorrect password");
          return;
        }
        else {
        this.onToast("success", "Login Success");       
          this.context.login(
            resData.data.login.token,
            resData.data.login.resellerId,
            username
          );
          
          localStorage.setItem("token", resData.data.login.token);
          localStorage.setItem("resellerId", resData.data.login.resellerId);
          localStorage.setItem("username", username);
          // localStorage.setItem("credits", resData.data.login.credits);
          // const datafromstore = localStorage.getItem('token');
          // console.log("localstorage userID in login.js", datafromstore);
          this.setState({ isLoading: false }); 
        }
      })
      .catch(err => {
        console.log(err);
        this.onToast("failed", "Something went wrong");
        this.setState({ isLoading: false });
      });
  };
  render() {
    return (
      <div className="login-body">
        <ToastContainer />
        <form className="auth-form" onSubmit={this.submitHandler}>
          <h3 className="label">WELCOME TO PANNEL</h3>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input type="username" id="username" ref={this.usernameEl} placeholder="Enter Your Username" />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={this.passwordEl} placeholder="Enter Your Password" />
          </div>
          <div className="form-actions">
          {(this.state.isLoading)&& <Spinner />}{(!this.state.isLoading) && <button type="submit">Login</button>}
          </div>
      </form>
    </div>
    )
  }
}

export default Login;