import React from 'react';

const MatchItem = ( props ) => (
  <div className="row">
		<div className="col"><img className="profilePic img-fluid img-thumbnail" src={ props.match.profile_img } /></div>
	  <div className="col">
	    <div className="profileInfo">Twitter Handle:&nbsp;{ props.match.username }</div>
			<div className="profileInfo">Location:&nbsp;{ props.match.location }</div>
	    <div className="profileInfo">{ props.match.about_me }</div>
	  </div>
	</div>
);

export default MatchItem;