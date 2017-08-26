import MatchItem from './MatchItem.jsx';
import React from 'react';

const MatchesList = ( props ) => (
  <div className="matchesList">
	  { props.matches === null ?
	  		"Sorry, we can't generate matches for you if your Tweets are protected." :
	  		(
		    	Array.isArray(props.matches) ?
			    	(
			    		props.matches.length ? 
			    			props.matches.map( ( match, index ) => (
			        		<MatchItem key={ index } match={ match._id } updateMatches={ props.updateMatches }/> )
			      		) :
			      		'No matches found'
			      ) :
			    	'loading matches...'
		    )
    }
  </div>  
);

export default MatchesList;