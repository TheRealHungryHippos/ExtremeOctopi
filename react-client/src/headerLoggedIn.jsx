import { Link } from 'react-router-dom';
import React from 'react';
import {compile} from 'path-to-regexp';

const MY_ROUTE_PROFILE = '/Profile/:userId/';
const toPath = compile(MY_ROUTE_PROFILE);
const MY_ROUTE_MESSAGES = '/Messages/:userId/';
const toPathMessages = compile(MY_ROUTE_MESSAGES)

const HeaderLoggedIn = () => (

  <nav className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top">
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
        <Link to="/test" className="navbar-brand">FriendZone</Link>
      </div>
    </h1>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item"><Link to='/test'>Test</Link></li>
        <li className="nav-item"><Link to={toPath({ userId: 'home'})}>Profile</Link></li>
        <li className="nav-item"><Link to='/matches'>Matches</Link></li>
        <li className="nav-item"><Link to={toPathMessages({ userId: 'home'})}>Messages</Link></li>
      </ul>
    </div>
  </nav>

);

export default HeaderLoggedIn;
