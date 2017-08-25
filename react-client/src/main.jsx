import { Switch, Route } from 'react-router-dom';
import Profile from './Profile.jsx';
import Matches from './Matches.jsx';
import Messages from './Messaging/Messages.jsx';
import React from 'react';
import $ from 'jquery';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: []
    };
  }

  setMatchesState(matches) {
    var newState = Object.assign({}, this.state);
    newState.matches = matches;
    this.setState(newState);
  }

  getMatches() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/matches/users',
      success: (matches) => {
        matches = JSON.parse(matches);
        context.setMatchesState(matches);
      },
      error: (error) => {
        console.log('ERROR:', error);
      }
    });
  }

  updateMatches(event) {
    var excludedUsername = event.target.id.split(',')[0];
    var route = event.target.id.split(',')[1];
    var context = this;
    $.ajax({
      method: 'POST',
      url: '/matches/' + route,
      contentType: 'application/JSON',
      data: JSON.stringify({excludedUsername: excludedUsername}),
      success: () => {
        context.getMatches();
      },
      error: (error) => {
        console.log('ERROR:', error);
      }
    });
  }

  componentDidMount() {
    this.getMatches();
  }

  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' render={() => (
            <Profile />
          )}/>
          <Route path='/profile' render={() => (
              <Profile />
            )}/>
          <Route exact path='/matches' render={() => (
              <Matches matches={this.state.matches} updateMatches={this.updateMatches.bind(this)}/>
            )}/>
          <Route exact path='/messages' render={() => (
                <Messages />
              )}/>
        </Switch>
      </main>
    )
  }
}

export default Main;
