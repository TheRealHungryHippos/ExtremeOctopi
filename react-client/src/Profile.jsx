import React from 'react';
import $ from 'jquery';

class Profile extends React.Component {
	constructor( props ) {
  	super( props );
  	this.state = {
  		profile_img: '',
      username: '',
      location: '',
      about_me: '',
      twitterUrl: ''
  	};

	}

	loadProfile(userId) {
      $.ajax({
        method: 'GET',
        url: '/user',
        success: (data) => {
          data = JSON.parse(data);
          this.setState ( {
            profile_img: data.profile_img,
            username: data.username || 'username not found',
            location: data.location || data.username + " doesn't share location",
            about_me: data.about_me || data.username + " doesn't have a Twitter bio",
            twitterUrl: 'https://twitter.com/' + data.username
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
            <div className="profileInfo">Twitter Handle:&nbsp;<a href={this.state.twitterUrl} target="_blank">@{ this.state.username }</a></div>
      			<div className="profileInfo">Location:&nbsp;{ this.state.location }</div>
            <div className="profileInfo">About Me:&nbsp;{ this.state.about_me }</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
