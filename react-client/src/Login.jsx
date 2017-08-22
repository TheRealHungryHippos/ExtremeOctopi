import React from 'react';
import $ from 'jquery';

class Login extends React.Component {
  constructor( props  ) {
    super( props );

    this.state = {
      username: '',
      password: ''
    };
  }

  handleInputChange ( event ) {
    event.preventDefault();

    const target = event.target;
    const name = target.name;

    this.setState( {
      [ name ]: target.value
    } );
  }

  handleSubmit( event ) {
    event.preventDefault();

    $.ajax( {
      method: 'POST',
      url: '/login',
      data: {
        username: this.state.username,
        password: this.state.password
      },
      success: ( data ) => {
        data = JSON.parse( data );

        if ( data ) {
          this.props.history.push( '/Matches/home/' );
        }
      },
      error: ( error ) => {
        console.log( 'ERROR: ', error );
      }
    } );
  }

  render() {
    return (
      <div className="login">
        <form className="form-signin" onSubmit={ this.handleSubmit.bind( this ) }>
          <label>
            Username:
            <input
              size="35"
              className="form-control"
              required=""
              autoFocus=""
              name="username"
              type="text"
              onChange={ this.handleInputChange.bind( this ) }>
            </input>
          </label>
          <label>
            Password: 
            <input
              size="35"
              className="form-control"
              required=""
              name="password"
              type="password"
              onChange={ this.handleInputChange.bind( this ) }>
            </input>
          </label>
          <button className="button btn btn-lg btn-primary btn-block" type="submit">Login</button>
        </form>
      </div>
    )
  }
}

export default Login