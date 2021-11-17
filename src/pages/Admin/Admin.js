import React, { Component } from 'react';
import Backdrop from '../../components/Backdrop/Backdrop'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from '../../components/Context/Context';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResellerTable from '../../components/Tables/ResellerTable'
import AdminTable from '../../components/Tables/AdminTable'
import {url} from '../../url';

import './Admin.css';
import  Modal  from '../../components/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
const usingurl = url.local;
class Admin extends Component {

  isActive = true;
  static contextType = AuthContext;

  constructor(props) {
    // console.log("constructor executed");
    super(props);
    this.usernameElRef = React.createRef();
    this.passwordElRef = React.createRef();
    this.creditsElRef = React.createRef();
    this.state = {
      users: [],
      creating: false,
      resellers:[],
      resellerCredits: 100000,
      resellerName: "All Users",
      addingCredits: false,
      isLoading: false,
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
      // console.log("res", res);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
    .then(resData => {
      // this.fetchCredits();
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
    // console.log("token", token);
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
      this.fetchCredits(token);
      newToken = token;
    }
    // console.log("newToken", newToken);
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
    // if (this.isActive) {
    //   this.setState({ isLoading: false });
    // }
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
  // this.setState({creating:false});
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
    
    // console.log(resData);
    if(resData.data.createReseller.credits<0){
      this.setState({isLoading: false});
      this.onToast("failed", "User already exist");
      return;
    }
    this.setState({isLoading: false});
    this.onToast("success", "Created Successfully");
    // this.setState(prevState => {
    //   const updatedResellers = [...prevState.resellers];
    //   updatedResellers.push({
    //     _id: resData.data.createReseller._id,
    //     username: resData.data.createReseller.username,
    //     credits: resData.data.createReseller.credits
    //   });
    //   this.setState({creating:false});
      
    //   return {resellers: updatedResellers};
    // });
    this.fetchResellers();
    this.setState({creating:false});

    
  })
  .catch(err => {
    this.onToast("failed", "Something went wrong");
    this.setState({creating:false});
  });

};

fetchCredits = token => {
  // console.log("Started fetch Credits", token);
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
       // console.log("redData", resData.data.getCredits.credits);
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
      // console.log("addingCredits", this.state.addingCredits);
        // const resellerData = {
        //     columns:[
        //         // {
        //         //     label: 'No',
        //         //     field: `${index}`,
        //         //     sort: 'asc',
        //         //     width: 150
        //         // },
        //         {
        //           label: 'Username',
        //           field: 'username',
        //           sort: 'asc',
        //           width: 150
        //       },
        //         {
        //             label: 'Password',
        //             field: 'password',
        //             sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Email',
        //             field: 'email',
        //             sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Start Date',
        //             field: 'startDate',
        //             sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'End Date',
        //             field: 'endDate',
        //             sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Devices',
        //             field: 'devices',
        //             sort: 'asc',
        //             width: 150
        //         },
        //     ],
        //     rows: this.state.users
        // };
        // const datafromstore = localStorage.getItem('token');
        // console.log("localstorage userID in login.js", datafromstore); 
        // console.log("admin data", this.state.resellers);
        return (
            <React.Fragment>
              <ToastContainer />
            {this.state.creating && <Backdrop />}
            {this.state.creating && (
            <Modal
            title="Create Reseller"
            canCancel = {!this.state.isLoading}
            canConfirm = {!this.state.isLoading}
            onCancel={this.cancelCreateReseller}
            onConfirm={this.createReseller}
            confirmText = "Create Reseller"
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
            </Modal>)}
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
            </Modal>)}
            <div className="admin-body">
                <div className="admin-body-header">
                  <div className="create-account">
                      <button className="btn" onClick={this.startCreateReseller}>Add Reseller</button>
                  </div>
                  <div className="add-credits">
                    <button className="btn" onClick={this.startAddingCredits}>Add credits</button>
                  </div>
                </div>
                <div className="admin-body-main">
                  <div className ="reseller-list-table">
                  {/* <ResellerList resellers={this.state.resellers} getUsers={this.fetchUsers} getCredits = {this.fetchCredits}/> */}
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
                    <ResellerTable data = {this.state.users}
                    />
                  </div>
                </div>
            </div>
            </React.Fragment>
        );
    }
}

export default Admin;