import React from 'react';
import $ from 'jquery';
import MessageFriend from './MessageFriend.jsx';

class MessageFriendList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: []
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
        <ul className="messageFriends">
          {this.state.friends.map(friend => {
            return <MessageFriend key={friend._id} profile={friend} selectFriend={this.props.selectFriend}/>
          })}
        </ul>
      </div>
    );
  }
}

export default MessageFriendList;
