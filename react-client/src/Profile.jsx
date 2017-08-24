import React from 'react';
import $ from 'jquery';

class Profile extends React.Component {
	constructor( props ) {
  	super( props );
  	// var regexp = /^\/Profile\/(.*)\/$/;
    // this.user = props.history.location.pathname.match( regexp )[ 1 ];

  	this.state = {
  		profile_img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
      username: '~(>_<~)',
      location: '~(>_<~)',
      about_me: '~(>_<~)'
  	};

	}

	loadProfile(userId) {
      $.ajax({
        method: 'GET',
        url: '/profile',
        success: (data) => {
          data = JSON.parse(data);
          this.setState ( {
            profile_img: data.profile_img || 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg',
            username: data.username || '~(>_<~)',
            location: data.location || '~(>_<~)',
            about_me: data.about_me || '~(>_<~)',
            twitterUrl: data.twitter_url || '~(>_<~)'
          } );
        },
        error: (error) => {
          console.log('********** Load Profile Error: ', error );
        }
      });
  }

  componentDidMount () {
    this.loadProfile(this.props.user);
  }

  render () {
    return (
      <div className="profile">
        <div className="profileRow row">
  		    <div className="col"><img className="profilePic img-fluid img-thumbnail" src={ this.state.profile_img } /></div>
          <div className="col">
            <div className="profileInfo">Twitter Handle:&nbsp;{ this.state.username }</div>
      			<div className="profileInfo">Location:&nbsp;{ this.state.location }</div>
            <div className="profileInfo">{ this.state.about_me }</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
