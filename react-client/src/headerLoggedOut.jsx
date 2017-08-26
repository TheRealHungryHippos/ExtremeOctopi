import { Link } from 'react-router-dom';
import React from 'react';
import {compile} from 'path-to-regexp';

const MY_ROUTE_PROFILE = '/Profile/:userId/';
const toPath = compile(MY_ROUTE_PROFILE);
const MY_ROUTE_MESSAGES = '/Messages/:userId/';
const toPathMessages = compile(MY_ROUTE_MESSAGES)

const HeaderLoggedOut = () => (

  <nav className="navbar navbar-light bg-faded fixed-top navbar-custom">
    
    <h1>
      <div>
        <Link to="/login" className="navbar-brand">FriendZone</Link>
      </div>
    </h1>
  </nav>

);

export default HeaderLoggedOut;
