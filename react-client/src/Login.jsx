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
      <div className="signIn">
        <h1 className="catchPhrase">Your Friends Are Here!</h1>
        <div className="signInBox">
          <h3>Sign in with Twitter</h3><img className="twitterLogo"src="https://imageog.flaticon.com/icons/png/512/23/23931.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF"/>
          <a href="/auth/twitter" className="signInButton button btn btn-lg btn-primary btn-block">Sign In</a>
        </div>
      </div>
    )
  }
}

export default Login