import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Data} from '../../data';
import ResellerTable from '../../components/Tables/ResellerTable'

import './Reseller.css';

import Backdrop from '../../components/Backdrop/Backdrop';
import Context from '../../components/Context/Context';
import Modal from '../../components/Modal/Modal';
import TabCom from '../../components/Tab/Tab';
// import { resellerData } from '../data';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../components/Spinner/Spinner';

const usingurl = Data.alterData.using.url;

class Reseller extends Component {
    
    state = {
        // data: resellerData,//users
        users: [],
        creating: false,
        credits: [],
        isLoading:false,
        payments: [],
        isEditing: false,
        isDeleting: false,
        isRenewing: false,
        willoptionUser:"",
        expireDate: "",
        devices: 0
    };

    static contextType = Context;

    constructor(props) {
        super(props);
        this.usernameElRef = React.createRef();
        this.newUsernameElRef = React.createRef();
        this.passwordElRef = React.createRef();
        this.emailElRef = React.createRef();
        this.periodElRef = React.createRef();
        this.devicesElRef = React.createRef();
        this.renewElRef = React.createRef();

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

    componentDidMount() {
        this.fetchUsers();
        this.fetchCredits();
        this.fetchPayments();

    }

    startEditUser = user => {
        this.setState({willoptionUser: user.username})
        this.setState({isEditing: true});
    }

    cancelEditUser = () => {
        this.setState({isEditing: false});
    }

    startDeleteUser = (userame) => {
        this.setState({willoptionUser: userame})
        this.setState({isDeleting: true});
    }

    cancelDeleteUser = () => {
        this.setState({isDeleting: false});
    }

    startRenewUser = (user) => {
        this.setState({isRenewing:true});
        this.setState({willoptionUser: user.username});
        this.setState({expireDate: user.endDate});
        this.setState({devices: user.devices});
    }

    cancelRenewUser = () => {
        this.setState({isRenewing: false});
    }

    renewUser = () => {
        this.setState({isLoading:true});
        const username = this.state.willoptionUser;
        const renew = +this.renewElRef.current.value;
        if (!renew|| renew<=0) {
            this.onToast("failed", "Please fill the form correctly");
            this.setState({isLoading: false});
            return;
          }
          let requestBody = {
            query: `
              mutation RenewUser($username: String!, $renew: Float!) {
                renewUser(username: $username, renew: $renew) {
                  username
                  renew
                }
              }
            `,
            variables: {
              username: username,
              renew: renew
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
              console.log("res", res);
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            if(resData.data.renewUser.username === "-1"){
              this.onToast("failed", "User not Exist");
              this.setState({isLoading:false});
              this.setState({isRenewing:false}); 
              return;
            }
            this.fetchUsers();
            this.onToast("success", "User Updated Successfully");
            this.setState({isLoading:false});
            this.setState({isRenewing:false});     
          })
          .catch(err => {
            this.onToast("failed", "Something went wrong");
            this.setState({isLoading:false});
            this.setState({isDeleting:false});  
          });
        
    }

    deleteUser = () => {
        this.setState({ isLoading: true }); 
        const username = this.usernameElRef.current.value;
        let requestBody = {
            query: `
              mutation DeleteUser($username: String!) {
                deleteUser(username: $username) {
                  username
                }
              }
            `,
            variables: {
              username: username,
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
            if(resData.data.deleteUser.username === "-1"){
              this.onToast("failed", "User not Exist");
              this.setState({isLoading:false});
              this.setState({isDeleting:false}); 
              return;
            }
            this.fetchUsers();
            this.onToast("success", "User Deleted Successfully");
            this.setState({isLoading:false});
            this.setState({isDeleting:false});     
          })
          .catch(err => {
            this.onToast("failed", "Something went wrong");
            this.setState({isLoading:false});
            this.setState({isDeleting:false});  
          });
    }

    editUser = () => {
        this.setState({ isLoading: true }); 
        const username = this.usernameElRef.current.value;
        const newUsername = this.newUsernameElRef.current.value;
        const password = this.passwordElRef.current.value;

        if (password.trim().length === 0) {
            this.onToast("failed", "Please fill the fields correctly")
            this.setState({ isLoading: false }); 
            return;
        }

        const requestBody = {
            query:`
                mutation EditUser($username: String!, $password: String!, $newUsername: String!) {
                    editUser(editUserInput: { username: $username, password: $password, newUsername: $newUsername}) {
                        newUsername
                    }
                }
            `,
            variables: {
                username: username,
                password: password,
                newUsername: newUsername, 
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
                if(resData.data.editUser.newUsername === "-1"){
                    this.onToast("failed", "User already exist");
                    this.setState({ isLoading: false }); 
                    return;
                }
                this.setState({creating:false});
                this.onToast("success", "User updated successfully!");
                this.setState({ isLoading: false }); 
                this.setState({ isEditing: false });
                this.fetchUsers();
            })
            .catch(err => {
                console.log(err);
                this.onToast("failed", "Something Went Wrong! Please try again later.");
                this.setState({ isLoading: false }); 
                this.setState({ isEditing: false });
            }); 
    }

    fetchPayments = () => {
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
                 Authorization: 'Bearer ' + this.context.token
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

   fetchCredits = () => {
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
                Authorization: 'Bearer ' + this.context.token
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
            this.setState({ credits: credits });
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
   }

    fetchUsers = () => {
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
        fetch(usingurl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const users = resData.data.users;
            this.setState({ users: users });
        })
        .catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    }
    startCreateUser = () => {
        this.setState({creating:true});
    }
    createUser = () =>{
        this.setState({ isLoading: true }); 
        const username = this.usernameElRef.current.value;
        const password = this.passwordElRef.current.value;
        const email = this.emailElRef.current.value;
        const period = +this.periodElRef.current.value;
        const devices = +this.devicesElRef.current.value;

        if (username.trim().length === 0 || password.trim().length === 0 || email.trim().length === 0 ||  period <= 0 || devices <= 0) {
            this.onToast("failed", "Please fill all the fields correctly")
            this.setState({ isLoading: false }); 
            return;
        }
        if(this.state.credits< +period*+devices){
            this.onToast("failed", "Not enough credits, please buy more credits.")
            this.setState({ isLoading: false }); 
            return; 
        }

        const requestBody = {
            query:`
                mutation CreatUser($username: String!, $password: String!, $email: String!, $devices: Float!, $period: Float!) {
                    createUser(userInput: { username: $username, password: $password, email: $email, devices: $devices, period: $period}) {
                        _id
                        username
                        password
                        email
                        startDate
                        endDate
                        devices
                    }
                }
            `,
            variables: {
                username: username,
                password: password,
                email: email,
                devices: devices,
                period: period
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
                    this.setState({ isLoading: false }); 
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if(resData.data.createUser.devices === -1){
                    this.onToast("failed", "User already exist");
                    this.setState({ isLoading: false }); 
                    return;
                }
                if(resData.data.createUser.devices === -2){
                    this.onToast("failed", "Email already exist");
                    this.setState({ isLoading: false }); 
                    return;
                }
                this.setState({creating:false});
                this.onToast("success", "User created successfully!");
                this.setState({ isLoading: false }); 
                this.fetchCredits();
                this.fetchUsers();
            })
            .catch(err => {
                console.log(err);
                this.onToast("failed", "Something Went Wrong!");
            });     
    }
    cancelCreateUser = () =>{
        this.setState({creating:false});
    }
    render() {
        return (
            <React.Fragment>
            <ToastContainer />
            {this.state.creating && <Backdrop />}
            {this.state.isDeleting && <Backdrop />}
            {this.state.isEditing && <Backdrop />}
            {this.state.isRenewing && <Backdrop />}
            {this.state.creating && (
            <Modal
            title="Create User"
            canCancel = {!this.state.isLoading}
            canConfirm = {!this.state.isLoading}
            onCancel={this.cancelCreateUser}
            onConfirm={this.createUser}
            confirmText = "Create User"
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username"  ref={this.usernameElRef}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="text" id="password" ref={this.passwordElRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="email">Email Adress</label>
                        <input type="email" id="email" ref={this.emailElRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="period">Period(Month)</label>
                        <input type="number" id="period" ref={this.periodElRef} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="devices">Devices</label>
                        <input type="number" id="devices" ref={this.devicesElRef} />
                    </div>
                    {this.state.isLoading &&<Spinner />}
                </form>
            </Modal>)}
            {this.state.isEditing && (
            <Modal
            title="Edit User"
            canCancel = {!this.state.isLoading}
            canConfirm = {!this.state.isLoading}
            onCancel={this.cancelEditUser}
            onConfirm={this.editUser}
            confirmText = "Edit User"
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="username">Old Username</label>
                        <input type="text" id="username"  ref={this.usernameElRef}disabled value={this.state.willoptionUser}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="newUsername">New Username</label>
                        <input type="text" id="newUsername"  ref={this.newUsernameElRef}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">New Password</label>
                        <input type="text" id="password" ref={this.passwordElRef} />
                    </div>
                    {this.state.isLoading &&<Spinner />}
                </form>
            </Modal>)}
            {this.state.isDeleting && (
            <Modal
            title="Delete User"
            canCancel = {!this.state.isLoading}
            canConfirm = {!this.state.isLoading}
            onCancel={this.cancelDeleteUser}
            onConfirm={this.deleteUser}
            confirmText = "Delete User"
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username"  ref={this.usernameElRef}disabled value={this.state.willoptionUser}/>
                    </div>
                    {this.state.isLoading &&<Spinner />}
                </form>
            </Modal>)}
            {this.state.isRenewing && (
            <Modal
            title="Renew User"
            canCancel = {!this.state.isLoading}
            canConfirm = {!this.state.isLoading}
            onCancel={this.cancelRenewUser}
            onConfirm={this.renewUser}
            confirmText = "Renew User"
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username"  ref={this.usernameElRef}disabled value={this.state.willoptionUser}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="expireDate">Expire Date</label>
                        <input type="text" id="expireDate" disabled value={this.state.expireDate}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="devices">Devices</label>
                        <input type="number" id="devices" disabled value={this.state.devices}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="renew">Renew(Months)</label>
                        <input type="number" id="renew" ref={this.renewElRef} />
                    </div>
                    {this.state.isLoading &&<Spinner />}
                </form>
            </Modal>)}
            <div className="reseller-body">
                <div className="reseller-body-header">
                    <div className="reseller-header-left">
                        <label className="credits-label">Credits:</label>
                        <h1 className="credits-number">{this.state.credits}</h1>
                    </div>
                    <div className="create-account">
                        <button className="btn add-user" onClick={this.startCreateUser}>Add User</button>
                    </div>
                </div>
                {/* <ResellerTable data={this.state.users}/> */}
                <TabCom data={this.state.users} payments ={this.state.payments} startEditUser={this.startEditUser} startDeleteUser={this.startDeleteUser} startRenewUser={this.startRenewUser}/>
            </div>
            
            </React.Fragment >
        );
    }
}

export default Reseller;