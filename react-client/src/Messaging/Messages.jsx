import React from 'react';
import $ from 'jquery';
var Promise = require('bluebird');
import MessagesList from './MessagesList.jsx';
import MessageFriendList from './MessageFriendList.jsx';
import MessageFriendSelected from './MessageFriendSelected.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriend: '',
      mutualFriends: [],
      messages: [],
      messageText: ''
    };
  }

  selectFriend(friend){
    this.getMessageHistory(friend.username);
    this.getMutualFriends(friend.username) //(or do this on/after friend list load)
    .then((friends) => {
      this.setState({
        mutualFriends: friends,
        selectedFriend: friend
      });
    });
  }

  getMutualFriends(friend) {
    var promise = new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/friends/mutual',
        data: {
          friend: friend
        },
        success: (friends) => {
          friends = JSON.parse(friends);
          resolve(friends);
        },
        error: (error) => {
          console.log('************* getMutualFriends ERROR:', error);
          reject(error);
        }
      });
    });
    return promise;
  }

//research socket io for messaging
//fix and test this on the server and db side
  getMessageHistory(friend) {
    $.ajax({
      method: 'POST',
      url: '/messages/hist',
      data: {
        friend: friend
      },
      success: (messages) => {
        messages = JSON.parse(messages);
        this.setState({
          messages: messages,
          selectedFriend: friend
        });
      },
      error: (error) => {
        console.log('********** getMessageHistory ERROR:', error);
      }
    });
  }

//fix / text this on the server & db side
  addMessage() {
    $.ajax({
      method: 'POST',
      url: '/messages/new',
      data: {
        friend: this.state.selectedFriend._id,
        message: this.state.messageText
      },
      success: (data) => {
        console.log('SUCCESS:', data);
        this.setState({
          message: ''
        });

        this.updateMessages(this.user, this.state.friend);
      },
      error: (error) => {
        console.log('ERROR:', error);
      }
    });
  }

  changeMessage(event) {
    this.setState({message: event.target.value});
  }

  render() {
    return (
      <div className="messages container">
        <div className="row justify-content-center">
          <div className="col-4">
            <div className="card">
              <h2 className="card-header">Friends</h2>
              <br/>
              <div className="card-block">
                <MessageFriendList selectFriend={this.selectFriend.bind(this)}/>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="card ">
              <h2 className="card-header">Messages</h2>
              <br/>
              <div className="card-block row">
                <div className="col">
                  <input className="submitMessageInput" onChange={this.changeMessage.bind(this)}></input>
                  <button onClick={this.addMessage.bind(this)}>Send Message</button>
                </div>
                <br></br>
              </div>
              <div className="row">
                <div className="col">
                  {this.state.messages.map((message, index) => (
                    <MessagesList key={index} message={message} friend={this.state.selectedFriend}/>
                  ))}
                  <br></br>
                  <br></br>
                </div>
                <MessageFriendSelected friend={this.state.selectedFriend} mutualFriends={this.state.mutualFriends} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;
