import React from 'react';

const token = localStorage.getItem('token');
const resellerId = localStorage.getItem('resellerId');


export default React.createContext({
 
    token: token,
    userId: resellerId,
    login: (token, resellerId) => {},
    logout: () => {}
});