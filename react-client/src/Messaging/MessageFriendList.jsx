import React from 'react';
import $ from 'jquery';
import MessageFriend from './MessageFriend.jsx';

class MessageFriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      selectedFriend: ''
    };
  }

  componentWillMount(){
    this.getFriends();
  }

  getFriends() {
    $.ajax({
      method: 'GET',
      url: '/friends',
      success: (data) => {
        data = JSON.parse(data);
        this.setState({friends: data});
      },
      error: (error) => {
        console.log('********** Get Friends Error: ', error );
      }
    });
  }

  render () {
    return (
      <div className="card-text">
        <ul class="messageFriends">
          {this.state.friends.map(friend => {
            return <MessageFriend profile={friend}/>
          })}
        </ul>
      </div>
    );
  }
}

export default MessageFriendList;
