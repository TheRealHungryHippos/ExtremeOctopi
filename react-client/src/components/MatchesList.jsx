import MatchItem from './MatchItem.jsx';
import React from 'react';

const MatchesList = ( props ) => (
  <div className="matchesList">
    { props.matches.length ? 
    	props.matches.map( ( match, index ) => (
        	<MatchItem key={ index } match={ match._id } updateMatches={ props.updateMatches }/> )
      	) :
      	'No matches found'
    }
  </div>  
);

export default MatchesList;