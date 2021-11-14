import React from "react";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import HouseIcon from '@material-ui/icons/House';
import SwitchAccountIcon from '@material-ui/icons/AccountBox';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import './Drawer.css';
import { NavLink } from 'react-router-dom';
import Context from '../Context/Context';


const styles = theme => ({
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
});

class DrawerComponent extends React.Component {
  state = {
    left: false
  };
  static contextType = Context;
  render() {
  
    const { classes } = this.props;

    const sideList = side => (
      <div
        className={classes.list}
        role="presentation"
        onClick={this.props.toggleDrawerHandler}
        onKeyDown={this.props.toggleDrawerHandler}
      >
        <List>
          {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
              <NavLink to="/home" className={classes.link}>
                <HouseIcon style={{ fontSize: 35 }}/> <span className="menu-item">Home</span>
              </NavLink>
              </List>
              <List>
              {!this.context.token && (
                                <NavLink to="/account" className={classes.link}><SwitchAccountIcon style={{ fontSize: 35 }}/><span className="menu-item">Account</span></NavLink>
                            )}
                            {this.context.token && (
                                <NavLink to="/account" className={classes.link}><SwitchAccountIcon style={{ fontSize: 35 }}/><span className="menu-item">{localStorage.getItem('username')}</span></NavLink>
                            )
                        }
              </List>
              <List>
                  <NavLink to="/shop" className={classes.link}>
                    <HouseIcon style={{ fontSize: 35 }}/> <span className="menu-item">Shop</span>
                  </NavLink>
              </List>
              <List>
              {!this.context.token && (
                                <NavLink to="/login" className={classes.link}><LockOpenIcon style={{ fontSize: 35 }}  /><span className="menu-item">Login</span></NavLink>
                            )}
                            {this.context.token && (
                                    <button onClick={this.context.logout} className={classes.link}><LockIcon style={{ fontSize: 35 }} /><span className="menu-item">Logout</span></button>                            
                            )}
              </List>
        <Divider />
        {/* <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </div>
    );

    return (
      <Drawer open={this.props.left} onClose={this.props.toggleDrawerHandler}>
        {sideList("left")}
      </Drawer>
    );
  }
}

export default withStyles(styles)(DrawerComponent);
