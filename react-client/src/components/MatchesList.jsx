import MatchItem from './MatchItem.jsx';
import React from 'react';

const MatchesList = ( props ) => (
  <div className="matchesList">
    { props.matches.map( ( match, index ) => (
        <MatchItem key={ index } match={ match }/> )
      ) 
    }
  </div>  
);

export default MatchesList;