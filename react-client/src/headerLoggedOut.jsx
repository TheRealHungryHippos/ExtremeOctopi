import { Link } from 'react-router-dom';
import React from 'react';
import {compile} from 'path-to-regexp';

const MY_ROUTE_PROFILE = '/Profile/:userId/';
const toPath = compile(MY_ROUTE_PROFILE);
const MY_ROUTE_MESSAGES = '/Messages/:userId/';
const toPathMessages = compile(MY_ROUTE_MESSAGES)

const HeaderLoggedOut = () => (

  <nav className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top navbar-custom">
    <button className="navbar-toggler navbar-toggler-right collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <h1>
      <div>
        <Link to="/login" className="navbar-brand">FriendZone</Link>
      </div>
    </h1>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item"><Link to='/login' className="nav-link">Sign In</Link></li>
        <li className="nav-item"><Link to='/signup' className="nav-link">Sign Up</Link></li>
      </ul>
    </div>
  </nav>

);

export default HeaderLoggedOut;
