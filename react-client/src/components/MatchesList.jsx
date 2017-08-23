import MatchItem from './MatchItem.jsx';
import React from 'react';

const MatchesList = ( props ) => (
  <div className="matchesList">
    <h3>Top Matches</h3>
    { props.matches.map( ( match, index ) => (
        <MatchItem lookupProfile={props.lookupProfile} key={ index } match={ match }/> )
      ) 
    }
  </div>  
);

export default MatchesList;