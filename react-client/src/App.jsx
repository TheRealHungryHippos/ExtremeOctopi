import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import HeaderLoggedIn from './headerLoggedIn.jsx';
import HeaderLoggedOut from './headerLoggedOut.jsx';
import Main from './main.jsx';
import Login from './Login.jsx';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true,
      user: '599d26cbb66b1cccca186505' //populated by twitter login
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
                <Main user={this.state.user}/>
              ) : (
                <Login login={this.logIn.bind(this)}/>
              )
            )}
          />
        </div>
      </Router>
    )
  }
}

export default App;
