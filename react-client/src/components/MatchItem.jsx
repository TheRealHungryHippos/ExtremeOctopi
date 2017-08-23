import React from 'react';

const MatchItem = ( props ) => (
  <div onClick={() => props.lookupProfile(props.match.fusername)} className="matchItem row">
    <div className="col">
      <img src={props.match.fpic}/>
    </div>
    <div className="col item-name">
      {props.match.fusername}
    </div>
  </div>
);

export default MatchItem;