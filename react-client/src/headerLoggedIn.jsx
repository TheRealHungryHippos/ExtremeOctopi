import { Link } from 'react-router-dom';
import React from 'react';
import {compile} from 'path-to-regexp';

const MY_ROUTE_PROFILE = '/Profile/:userId/';
const toPath = compile(MY_ROUTE_PROFILE);
const MY_ROUTE_MESSAGES = '/Messages/:userId/';
const toPathMessages = compile(MY_ROUTE_MESSAGES)

const HeaderLoggedIn = () => (


  <nav className="navbar navbar-inverse">
  <div className="container-fluid">
  <div className="navbar-header">
  <a className="navbar-brand" href="#"><img src="logo.png" width="70" height="70" className="d-inline-block align-top" alt=""/></a>

  </div>
  <ul className="nav navbar-nav">
    <li className="nav-item"><Link to='/signup'>Signup</Link></li>
    <li className="nav-item"><Link to='/test'>Test</Link></li>
    <li className="nav-item"><Link to='/login'>Login</Link></li>
    <li className="nav-item"><Link to={toPath({ userId: 'home'})}>Profile</Link></li>
    <li className="nav-item"><Link to='/matches'>Matches</Link></li>
    <li className="nav-item"><Link to={toPathMessages({ userId: 'home'})}>Messages</Link></li>
  </ul>
  </div>
  </nav>

);

export default HeaderLoggedIn;
