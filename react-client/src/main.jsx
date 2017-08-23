import { Switch, Route } from 'react-router-dom';
import Profile from './Profile.jsx';
import Matches from './Matches.jsx';
import Messages from './Messages.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import React from 'react';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/signup' component={Signup}/>
      <Route path='/login' component={Login}/>
      <Route path='/profile' component={Profile}/>
      <Route path='/matches' component={Matches}/>
      <Route path='/messages' component={Messages}/>
    </Switch>
  </main>
)

export default Main
