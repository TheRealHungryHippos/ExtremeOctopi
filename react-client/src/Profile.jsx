import React from 'react';

class Profile extends React.Component {
	constructor( props ) {
  	super( props );

  	console.log(props);

  	var regexp = /^\/Profile\/(.*)\/$/;
    this.user = props.history.location.pathname.match( regexp )[ 1 ];

  	this.state = {
  		profilePic: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
      username: '(ノ°Д°）ノ︵ ┻━┻ | Please log in',
  		fullname: 'Not Logged In',
  		location: '(ノ°Д°）ノ︵ ┻━┻ | Please log in',
  		hobbies: '(ノ°Д°）ノ︵ ┻━┻ | Please log in',
  		aboutme: '(ノ°Д°）ノ︵ ┻━┻ | Please log in',
  	};

  	this.loadProfile(this.user);

  	this.handleClick = this.handleClick.bind(this);

	}

	loadProfile(user) {
    if(user === 'home') {
      $.ajax( {
        method: 'GET',
        url: '/profile',
        success: ( data ) => {
          var data = JSON.parse( data );
          this.setState ( {
            profilePic: data.img || 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
            username: data.username || '~(>_<~)',
            fullname: data.fullname || '~(>_<~)',
            location: data.location || '~(>_<~)',
            hobbies: data.hobbies || '~(>_<~)',
            aboutme: data.blog || '~(>_<~)'
          } );
        },
        error: ( error ) => {
          console.log( 'ERROR:', error );
        }
      } );
    } else {
      $.post( '/friendProfile', {username: user}, (data) =>
      {
        var data = JSON.parse( data );
        this.setState ( {
          profilePic: data.img || 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
          username: data.username || '~(>_<~)',
          fullname: data.fullname || '~(>_<~)',
          location: data.location || '~(>_<~)',
          hobbies: data.hobbies || '~(>_<~)',
          aboutme: data.blog || '~(>_<~)'
        } );
      });
    }
  }

  handleClick() {
    this.props.history.push( '/Messages/' + this.user + '/' );
  }

  componentDidMount () {

  }

  render () {
    return (
      <div className="container">
  			  <img className="img-circle" src={ this.state.profilePic }></img>
          <div className="col-xs-10 center-text">
      	    <h1>{ this.state.fullname }'s Zone</h1>
            <br/>
            <strong>Username:&nbsp;</strong>{ this.state.username }
      	    <br/>
      			<strong>Location:&nbsp;</strong>{ this.state.location }
  					<br/>
            <strong>Hobbies:&nbsp;</strong>{ this.state.hobbies }
            <br/>
            <strong>About Me:&nbsp;</strong>{ this.state.aboutme }
            <br/>
            <button className="message-button" onClick={() => this.handleClick()}><img src="logo.png" width="30" height="30" className="d-inline-block align-top" alt=""/>Send { this.state.fullname } a message!</button>
          </div>
      </div>
    );
  }
}

export default Profile