import React from 'react';
import $ from 'jquery';

class MessageFriendSelected extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friend_name: '',
      friend_about: '',
      friend_img: '',
      friend_twitterUrl: ''
    };

    // this.updateMessages(this.user);
  }

  render () {
    return (
      <div>
      <div className="talk-bubble tri-right left-top">
      <div className="talktext">
        <strong>Friend Selected</strong>
      </div>
      </div>
      </div>
    );
  }
}

export default MessageFriendSelected;
