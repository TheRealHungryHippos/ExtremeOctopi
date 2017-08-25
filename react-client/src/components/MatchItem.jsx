import React from 'react';

const MatchItem = ( props ) => (
  <div className="row">
		<div className="col"><img className="profilePic img-fluid img-thumbnail" src={ props.match.profile_img } /></div>
	  <div className="col">
	    <div className="profileInfo">Twitter Handle:&nbsp;<a href={'https://twitter.com/' + props.match.username} target="_blank">@{ props.match.username }</a></div>
			<div className="profileInfo">Location:&nbsp;{ props.match.location || props.match.username + " doesn't share location" }</div>
	    <div className="profileInfo">About {props.match.username}:&nbsp;{ props.match.about_me || props.match.username + " doesn't have a Twitter bio" }</div>
	    <button className="button btn btn-lg btn-primary btn-block" id={props.match.username + ',friend'} onClick={props.updateMatches} >Message</button>
	    <button className="button btn btn-lg btn-primary btn-block" id={props.match.username + ',block'} onClick={props.updateMatches} >Pass</button>
	  </div>
	</div>
);

export default MatchItem;