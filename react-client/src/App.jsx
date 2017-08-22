import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link
} from 'react-router-dom';
import HeaderLoggedIn from './headerLoggedIn.jsx';
import HeaderLoggedOut from './headerLoggedOut.jsx';
import Main from './main.jsx';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    };
  }

  logIn() {
    this.setState({authenticated: !this.state.authenticated});
  }

  logOut(){
    this.setState({authenticated: !this.state.authenticated});
  }

  render () {
    return (
      <Router>
    		<div>
          <Route path="/" render={(props) => (
              this.state.authenticated ? (
                <HeaderLoggedIn logout={this.logOut.bind(this)}/>
              ) : (
                <HeaderLoggedOut />
              )
            )}
          />

	      <Main />
        </div>
      </Router>
    )
  }
}

export default App;
