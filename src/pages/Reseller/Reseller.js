import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {url} from '../../url';
import ResellerTable from '../../components/Tables/ResellerTable'

import './Reseller.css';

import Backdrop from '../../components/Backdrop/Backdrop';
import Context from '../../components/Context/Context';
import Modal from '../../components/Modal/Modal';
// import { resellerData } from '../data';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const usingurl = url.local;

class Reseller extends Component {
    
    state = {
        // data: resellerData,//users
        users: [],
        creating: false,
        credits: [],
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
        const username = this.usernameElRef.current.value;
        const password = this.passwordElRef.current.value;
        const email = this.emailElRef.current.value;
        const period = +this.periodElRef.current.value;
        const devices = +this.devicesElRef.current.value;

        // const username = "firstuser3";
        // const password = "123456";
        // const email = "test@testemail.com";
        // const period = 1;
        // const devices = 1;

        if (username.trim().length === 0 || password.trim().length === 0 || email.trim().length === 0 ||  period <= 0 || devices <= 0) {
            this.onToast("failed", "Please fill all the fields correctly")
            return;
        }
        if(this.state.credits< +period*+devices){
            this.onToast("failed", "Not enough credits, please buy more credits.")
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
                throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                if(resData.data.createUser.devices === -1){
                    this.onToast("failed", "User already exist");
                    return;
                }
                if(resData.data.createUser.devices === -2){
                    this.onToast("failed", "Email already exist");
                    return;
                }
                // this.setState(prevState => {
                // const updatedUsers = [...prevState.users];
                // updatedUsers.push({
                //     _id: resData.data.createUser._id,
                //     username: resData.data.createUser.username,
                //     password: resData.data.createUser.password,
                //     email: resData.data.createUser.email,
                //     startDate: resData.data.createUser.startDate,
                //     endDate: resData.data.createUser.endDate,
                //     devices: resData.data.createUser.devices,
                // });
                this.setState({creating:false});
                // return { users: updatedUsers };
                // });
                this.onToast("success", "User created successfully!");
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
        // const tableData = {
        //     columns:[
        //         {
        //             label: 'Username',
        //             field: 'username',
        //             sort: 'dsc',
        //             width: 150
        //         },
        //         {
        //             label: 'Password',
        //             field: 'password',
        //             // sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Email',
        //             field: 'email',
        //             // sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Start Date',
        //             field: 'startDate',
        //             sort: 'dsc',
        //             width: 150
        //         },
        //         {
        //             label: 'End Date',
        //             field: 'endDate',
        //             // sort: 'asc',
        //             width: 150
        //         },
        //         {
        //             label: 'Devices',
        //             field: 'devices',
        //             // sort: 'asc',
        //             width: 150
        //         },
        //     ],
        //     rows: this.state.users
        // };
        return (
            <React.Fragment>
                {/* <p>{this.state.users.length > 0 && this.state.users[0].username}</p> */}
            <ToastContainer />
            {this.state.creating && <Backdrop />}
            {this.state.creating && (
            <Modal
            title="Create User"
            canCancel
            canConfirm
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
                {/* <div className="reseller-table"> */}
                <ResellerTable data={this.state.users}/>
                {/* </div> */}
            </div>
            </React.Fragment>
        );
    }
}

export default Reseller;