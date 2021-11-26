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
        payments: [{_id:"theajfsdf434f$",credits:30, price:150, createdAt:"2021/11/15"},
                    {_id:"tethew$#FFEF33",credits:30, price:150, createdAt:"2021/11/15"}             ],
                };

    static contextType = Context;

    constructor(props) {
        super(props);
        this.usernameElRef = React.createRef();
        this.passwordElRef = React.createRef();
        this.emailElRef = React.createRef();
        this.periodElRef = React.createRef();
        this.devicesElRef = React.createRef();

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
                <TabCom data={this.state.users} payments ={this.state.payments}/>
            </div>
            
            </React.Fragment >
        );
    }
}

export default Reseller;