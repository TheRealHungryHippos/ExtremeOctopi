import FriendsPendingRequestSent from './FriendsPendingRequestSent.jsx';
import FriendsPendingRequestReceived from './FriendsPendingRequestReceived.jsx';
import React from 'react';

const FriendsPendingRequests = (props) => (
    
  <div>
    {props.receivedRequests.map()}
    {props.sentRequests.map()}
  </div>

)

export default FriendsPendingRequests