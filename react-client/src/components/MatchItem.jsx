import React from 'react';

const MatchItem = ( props ) => (
  <div className="matchItem row align-items-center">
		<div className="col-sm-3"><img className="matchProfilePic img-fluid img-thumbnail" src={ props.match.profile_img } /></div>
	  <div className="col-sm-7">
	    <div><b>Twitter Handle:</b>&nbsp;<a href={'https://twitter.com/' + props.match.username} target="_blank">@{ props.match.username }</a></div>
			<div><b>Location:</b>&nbsp;{ props.match.location || props.match.username + " doesn't share location" }</div>
	    <div><b>About {props.match.username}:</b>&nbsp;{ props.match.about_me || props.match.username + " doesn't have a Twitter bio" }</div>
	  </div>
    <div className="col-sm-2">
	    <button className="matchItemButton row button btn btn-lg btn-primary btn-block" id={props.match.username + ',friend'} onClick={props.updateMatches} >Message</button>
	    <button className="matchItemButton row button btn btn-lg btn-primary btn-block" id={props.match.username + ',block'} onClick={props.updateMatches} >Pass</button>
	  </div>
	</div>
);

export default MatchItem;