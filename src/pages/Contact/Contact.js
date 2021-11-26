import React, { Component } from 'react';
import Backdrop from '../../components/Backdrop/Backdrop'
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from '../../components/Spinner/Spinner';
import {Data} from '../../data';
import MailIcon from "@material-ui/icons/Close";
import './Contact.css'
// import AuthContext from '../../components/Context/Context';

const usingurl = Data.alterData.using.url;
class Contact extends Component {

    // static contextType = AuthContext;

    state = {
        // isLoading: false,
        submitResultText:"",
        buttonState:true,
        submitResultTextState: false,
    }

    constructor(props) {
        super(props);
        this.nameEl = React.createRef();
        this.emailEl = React.createRef();
        this.subjectEl = React.createRef();
        this.messageEl = React.createRef();
    }

    enalbeButton = () => {
        this.setState({buttonState:true});
        this.setState({submitResultTextState:false});
    }

    submitHandler = event => {
        event.preventDefault();
        this.setState({buttonState:false});
        
        const name = this.nameEl.current.value;
        const email = this.emailEl.current.value;
        const subject = this.subjectEl.current.value;
        const message = this.messageEl.current.value;

        let requestBody = {
            query: `
              mutation Contact($name: String!, $email: String!, $subject: String!, $message: String!) {
                contact(contactInput: {name: $name, email: $email, subject: $subject, message: $message}) {
                  name                 
                }
              }
            `,
            variables: {
              name: name,
              email: email,
              subject: subject,
              message: message
            }
          }
      
          fetch(usingurl, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            this.setState({submitResultText:'Thanks for subscribing!, We\'ll contact in a day!'});
            this.setState({submitResultTextState:true});    
          })
          .catch(err => {
            this.setState({submitResultText:'Something went wrong, pleae try again later!'});
            this.setState({submitResultTextState:true}); 
          });

        // 
        // 
        }
    render() {
        return (
        <div className="contact-body">
            <section class="mb-4">
                <h2 class="h1-responsive font-weight-bold text-center my-4">Contact us</h2>
                <p class="text-center w-responsive mx-auto mb-5">Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you within
                    a matter of hours to help you.</p>
                <div class="row">
                <div class="col-md-3 text-center"></div>
                    <div class="col-md-6 mb-md-0 mb-5">
                        <form   onSubmit = {this.submitHandler}>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="md-form mb-0">
                                        <label for="name" class="contact-form-label">Your name</label>
                                        <input type="text" id="name" name="name" required ref={this.nameEl} class="form-control" placeholder="Name" />                                    
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="md-form mb-0">
                                        <label for="email" class="contact-form-label">Your email</label>
                                        <input type="email" id="email" name="email" required ref = {this.emailEl} class="form-control" placeholder="Email" />                            
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="md-form mb-0">
                                        <label for="subject" class="contact-form-label">Subject</label>
                                        <input type="text" id="subject" name="subject" required ref = {this.subjectEl} class="form-control" placeholder="Subject" />                            
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="md-form">
                                        <label for="message" class="contact-form-label">Your message</label>
                                        <textarea type="text" id="message" name="message" required ref={this.messageEl} rows="5" class="form-control md-textarea" placeholder="Describe Birefly What you need from us."></textarea>
                                    </div>
                                </div>
                            </div>
                            {this.state.buttonState?(<div class="text-center text-md-left">
                                <button type="submit" className="btn">Submit</button>
                            </div>):
                            (<div class="text-center text-md-left">
                                <button type="submit" className="btn"  disabled>Submit</button>
                            </div>)}
                            {this.state.submitResultTextState &&(<div class="text-center text-md-left submit-text">
                                <p className="submitted-text">{this.state.submitResultText} <button className="submitted-text" onClick={this.enalbeButton}> <MailIcon /></button> </p>
                            </div>)
                            }
                        </form>

                        
                        <div class="status"></div>
                    </div>
                    <div class="col-md-3 text-center">
                        {/* <ul class="list-unstyled mb-0">
                            <li><i class="fas fa-map-marker-alt fa-2x"></i>
                                <p>San Francisco, CA 94126, USA</p>
                            </li>
                            <li><i class="fas fa-phone mt-4 fa-2x"></i>
                                <p>+ 01 234 567 89</p>
                            </li>

                            <li><i class="fas fa-envelope mt-4 fa-2x"></i>
                                <p>contact@jx-panel.com</p>
                            </li>
                        </ul> */}
                    </div>
                </div>
            </section>
        </div>
        )
    }
}
export default Contact;