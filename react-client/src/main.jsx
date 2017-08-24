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
      matches: [
        { profile_img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
          username: '~(>_<~)',
          location: '~(>_<~)',
          about_me: "I'm Cartman. Respect my authority. South Park is overrated." 
        },
        { profile_img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
          username: '~(>_<~)',
          location: '~(>_<~)',
          about_me: "I'm Cartman. Respect my authority. South Park is overrated." 
        },
        { profile_img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
          username: '~(>_<~)',
          location: '~(>_<~)',
          about_me: "I'm Cartman. Respect my authority. South Park is overrated." 
        },
        { profile_img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
          username: '~(>_<~)',
          location: '~(>_<~)',
          about_me: "I'm Cartman. Respect my authority. South Park is overrated."
        }
      ]
    };
  }

  updateMatches(matches) {
    var newState = Object.assign({}, this.state);
    newState.matches = matches;
    this.setState(newState);
  }

  getMatches() {
    var context = this;
    $.ajax({
      method: 'GET',
      url: '/matches',
      success: (matches) => {
        data = JSON.parse(matches);
        context.updateMatches(matches);
      },
      error: (error) => {
        console.log('ERROR:', error);
      }
    });
  }

  // UNCOMMENT WHEN YOU WANT TO DO TWITTER API REQUESTS ON LOG IN

  // componentDidMount() {
  //   this.getMatches();
  // }

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
          <Route path='/matches' render={() => (
              <Matches matches={this.state.matches} />
            )}/>
          <Route path='/messages' render={() => (
                <Messages />
              )}/>
        </Switch>
      </main>
    )
  }
}

export default Main;
