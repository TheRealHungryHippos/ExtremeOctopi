import React from 'react';
import $ from 'jquery';

class Profile extends React.Component {
	constructor( props ) {
  	super( props );
  	this.state = {
      profile_img: '',
      fullname: '',
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
            fullname: data.fullname,
            username: data.username || 'username not found',
            location: data.location,
            about_me: data.about_me || "Your Twitter account doesn't have a bio",
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
      <div className="profileContainer">
        <div className="usernameHeadingContainer row"><h1 className="usernameHeading">{this.state.username}</h1></div>
        <div className="profile">
          <div className="row">
    		    <div className="col-sm-4"><img className="profilePic img-fluid img-thumbnail" src={ this.state.profile_img } /></div>
            <div className="col-sm-8">
              <div className="profileInfo"><b>Twitter Handle:</b>&nbsp;<a href={this.state.twitterUrl} target="_blank">@{ this.state.username }</a></div>
        			<div className="profileInfo"><b>Full Name:</b>&nbsp;{ this.state.fullname }</div>
        			<div className="profileInfo"><b>Location:</b>&nbsp;{ this.state.location }</div>
              <div className="profileInfo"><b>About Me:</b>&nbsp;{ this.state.about_me }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
