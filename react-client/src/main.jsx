import { Switch, Route } from 'react-router-dom';
import Profile from './Profile.jsx';
import Matches from './Matches.jsx';
import Messages from './Messages.jsx';
import React from 'react';

const Main = (props) => (
  <main>
    <Switch>
      <Route exact path='/' render={() => (
        <Profile user={props.user} />
      )}/>
      <Route path='/profile' render={() => (
          <Profile user={props.user} />
        )}/>
      <Route path='/matches' render={() => (
          <Matches user={props.user} />
        )}/>
      <Route path='/messages' render={() => (
            <Messages user={props.user} />
          )}/>
    </Switch>
  </main>
)

export default Main;
