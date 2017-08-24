import React from 'react';
import $ from 'jquery';

class FriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      selectedFriend: ''
    };

    // this.updateMessages(this.user);
  }

  render () {
    return (
      <div>
      <div className="talk-bubble tri-right left-top">
      <div className="talktext">
        <strong>Friend List</strong>
      </div>
      </div>
      </div>
    );
  }
}

export default FriendList;
