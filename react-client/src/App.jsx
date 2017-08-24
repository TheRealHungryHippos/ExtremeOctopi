import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import $ from 'jquery';
import HeaderLoggedIn from './headerLoggedIn.jsx';
import HeaderLoggedOut from './headerLoggedOut.jsx';
import Main from './main.jsx';
import Login from './Login.jsx';
var Promise = require('bluebird');

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      authenticated: false
    };
  }

  componentWillMount(){
    this.setState({loading: true});
    this.isLoggedIn()
    .then((confirmed) => {
      console.log('************** after logged in check in component will mount ', this.state.authenticated);
      this.setState({
        authenticated: confirmed,
        loading: false
      });
    });
  }

  isLoggedIn() {
    var promise = new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: '/auth',
        success: (confirmed) => {
          confirmed = JSON.parse(confirmed);
          // this.setState({authenticated: data});
          resolve(confirmed);
        },
        error: (error) => {
          console.log('********** Authentication Check Error: ', error );
          reject(error);
        }
      });
    });
    return promise;
  }

  logOut(){
    this.setState({authenticated: false});
  }

  render () {
    if (this.state.loading) {
      return null;
    }
    return (
      <Router>
    		<div>
          <Route path="/" render={() => (
              this.state.authenticated ? (
                <HeaderLoggedIn logout={this.logOut.bind(this)}/>
              ) : (
                <HeaderLoggedOut />
              )
            )}
          />
          <Route path="/" render={() => (
              this.state.authenticated ? (
                <Main />
              ) : (
                <Login />
              )
            )}
          />
        </div>
      </Router>
    )
  }
}

export default App;
