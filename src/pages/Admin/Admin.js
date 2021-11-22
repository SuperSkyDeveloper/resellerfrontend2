import React, { Component } from 'react';
import Backdrop from '../../components/Backdrop/Backdrop'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../../components/Context/Context';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResellerTable from '../../components/Tables/ResellerTable'
import AdminTable from '../../components/Tables/AdminTable'
import {Data} from '../../data';
import './Admin.css';
import  Modal  from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import TabCom from '../../components/Tab/Tab';

const usingurl = Data.alterData.using.url;

class Admin extends Component {

  isActive = true;
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.usernameElRef = React.createRef();
    this.passwordElRef = React.createRef();
    this.creditsElRef = React.createRef();
    this.state = {
      users: [],
      payments: [],
      resellers:[],
      resellerCredits: 100000,
      resellerName: "Panel Manager",
      addingCredits: false,
      isLoading: false,
      creating: false,
    };
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

  fetchPayments = token => {
    const requestBody = {
        query: `
        query {
            paymentslog {
                _id
                credits
                price
                createdAt                    
            }
        }           
        `
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
         if (res.status !== 200 && res.status !== 201) {
         throw new Error('Failed!');
         }
         return res.json();
     })
     .then(resData => {
         const payments = resData.data.paymentslog;
         this.setState({ payments: payments });
     })
     .catch(err => {
         console.log(err);
         this.setState({ isLoading: false });
     });
}

  addCredits = event =>{
    event.preventDefault();
    this.setState({isLoading:true});
    const resellerName = this.state.resellerName;
    const credits = +this.creditsElRef.current.value;
  
    if (!credits|| credits<=0) {
      this.onToast("failed", "Please fill the form correctly");
      this.setState({isLoading: false});
      return;
    } 
  
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
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      this.setState({resellerCredits:resData.data.addCredits.credits});
      this.onToast("success", "Credits added Successfully");
      this.setState({isLoading:false});
      this.setState({addingCredits:false});     
    })
    .catch(err => {
      this.onToast("failed", "Something went wrong");
      this.setState({isLoading:false});
      this.setState({creating:false});
    });
    
  };  

  fetchUsers = token => {
    const requestBody = {
        query: `
            query {
                users {
                    _id
                    username
                    password
                    email
                    startDate
                    endDate
                    devices
                }
                
            }
        `
    };
    let newToken
    if(!token){
      newToken = this.context.token;
    }
    if(token) {
      newToken = token;
    }
    this.fetchCredits(newToken);
    this.fetchPayments(newToken);
    fetch(usingurl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + newToken
        }
    })
    .then(res => {
        if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
        }
        return res.json();
    })
    .then(resData => {
        // console.log("resData", resData);
        const users = resData.data.users;
        this.setState({ users: users });
    })
    .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
    }); 
  }
  
  fetchResellers() {
    const requestBody = {
      query: `
        query {
          resellers {
            _id
            username
            credits
            token
          }
        }
      `
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
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      const resellers = resData.data.resellers;
      if (this.isActive) {
        this.setState({ resellers: resellers });
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
 
  componentDidMount() {
    this.fetchResellers();
    this.fetchUsers();
  }

  startCreateReseller = () =>{
      this.setState({creating:true});
  }
  startAddingCredits = () => {
    if(this.state.resellerName === "All Users") {
      this.onToast("failed", "Please select one of your resellers")
      return;
    }
    this.setState({addingCredits:true});
  }

  cancelCreateReseller = () =>{
      this.setState({creating:false});
  }

  cancelAddingCredits = () =>{
    this.setState({addingCredits:false});
  }

  createReseller = event =>{
    event.preventDefault();
    this.setState({isLoading: true});
    const username = this.usernameElRef.current.value;
    const password = this.passwordElRef.current.value;
    const credits = +this.creditsElRef.current.value;

    if (username.trim().length === 0 || password.trim().length === 0 || credits<=0) {
      this.setState({isLoading: false});
      this.onToast("failed", "Please fill all the forms");
      return;
    } 

    let requestBody = {
      query: `
        mutation CreateReseller($username: String!, $password: String!, $credits: Float!) {
          createReseller(resellerInput: {username: $username, password: $password, credits: $credits}) {
            _id
            username
            credits
            token
          }
        }
      `,
      variables: {
        username: username,
        password: password,
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
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      if(resData.data.createReseller.credits<0){
        this.setState({isLoading: false});
        this.onToast("failed", "User already exist");
        return;
      }
      this.setState({isLoading: false});
      this.onToast("success", "Created Successfully");
      this.fetchResellers();
      this.setState({creating:false});    
    })
    .catch(err => {
      this.onToast("failed", "Something went wrong");
      this.setState({creating:false});
    });

  };

  fetchCredits = token => {
    const requestBody = {
        query: `
        query {
            getCredits {
                credits
                username
            }
        }         
        `
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
        if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
        }
        return res.json();
    })
    .then(resData => {
        const credits = resData.data.getCredits.credits;
        const username = resData.data.getCredits.username; 
        this.setState({ resellerCredits: credits, resellerName: username });
    })
    .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.isActive = false;
  }
  render() {
      return (
          <React.Fragment>
            <ToastContainer />
            {this.state.creating && <Backdrop />}
            {this.state.creating && (
              <Modal
              title="Create Seller"
              canCancel = {!this.state.isLoading}
              canConfirm = {!this.state.isLoading}
              onCancel={this.cancelCreateReseller}
              onConfirm={this.createReseller}
              confirmText = "Create Sseller"
              >
                <form>
                <div className="form-control">
                    <label htmlFor="title">Username</label>
                    <input type="text" id="username" ref={this.usernameElRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="title">Password</label>
                    <input type="text" id="password" ref={this.passwordElRef} />
                </div>
                <div className="form-control">
                    <label htmlFor="price">Credits</label>
                    <input type="number" id="credits" ref={this.creditsElRef} />
                </div>
                {this.state.isLoading &&<Spinner />}
                </form>
              </Modal>
            )}
            {this.state.addingCredits && <Backdrop />}
            {this.state.addingCredits && (
              <Modal
              title="Add credits"
              canCancel = {!this.state.isLoading}
              canConfirm = {!this.state.isLoading}
              onCancel={this.cancelAddingCredits}
              onConfirm={this.addCredits}
              confirmText = "Add Credits"
              >
                  <form>
                  <div className="form-control">
                      <label htmlFor="price">Credits</label>
                      <input type="number" id="credits" ref={this.creditsElRef} />
                  </div>
                  {this.state.isLoading &&<Spinner />}
                  </form>
              </Modal>
            )}
            <div className="admin-body">
              <div className="admin-body-header">
                <div className="create-account">
                    <button className="btn" onClick={this.startCreateReseller}>Add Seller</button>
                </div>
                <div className="add-credits">
                  <button className="btn" onClick={this.startAddingCredits}>Add credits</button>
                </div>
              </div>
              <div className="admin-body-main">
                <div className ="reseller-list-table">
                  <AdminTable data = {this.state.resellers} getUsers={this.fetchUsers} getCredits = {this.fetchCredits}/>
                </div>
                <div className="admin-table">                  
                  <div className="table-header">                      
                    <div className="table-header-element">
                      <label>Credits: </label>
                      <h2>{this.state.resellerCredits}</h2>
                    </div>
                    <div className="table-header-element">
                      <h2>{this.state.resellerName}</h2>
                    </div>                    
                  </div>
                  {/* <ResellerTable data = {this.state.users}/> */}
                  <TabCom data={this.state.users} payments ={this.state.payments}/>
                </div>
              </div>
            </div>
          </React.Fragment>
      );
  }
}

export default Admin;