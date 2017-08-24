import FriendsPendingRequests from './components/FriendsPendingRequests.jsx';
import FriendsList from './components/FriendsList.jsx';
import React from 'react';

class Friends extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div className="friends">
        <FriendsPendingRequests />
        <FriendsList />
      </div>
    )
  }
}

export default Friends