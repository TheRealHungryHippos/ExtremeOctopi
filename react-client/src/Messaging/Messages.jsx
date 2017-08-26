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
    this.getMutualFriends(friend.username)
    .then((friends) => {
      this.setState({
        mutualFriends: friends,
        selectedFriend: friend
      });
    });

    this.getMessageHistory(friend.username)
    .then((messages) => {
      this.addClassType(messages, friend)
      .then((messages) => {
        this.setState({
          messages: messages
        });
      })
    })
  }

  addClassType(messages, friend){
    var promise = new Promise((resolve, reject) => {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].sender === friend.username) {
          messages[i]['classType'] = 'talk-bubble-left tri-right left-in';
        } else {
          messages[i]['classType'] = 'talk-bubble-right tri-right round right-in';
        }
      }
      resolve(messages);
    });
    return promise;
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
  getMessageHistory(friend) {
    var promise = new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: '/messages/hist',
        data: {
          friend: friend
        },
        success: (messages) => {
          messages = JSON.parse(messages);
          resolve(messages);
        },
        error: (error) => {
          console.log('********** getMessageHistory ERROR:', error);
          reject(error);
        }
      });
    });
    return promise;
  }

//fix / text this on the server & db side
  addMessage() {
    $.ajax({
      method: 'POST',
      url: '/messages/new',
      data: {
        friend: this.state.selectedFriend.username,
        message: this.state.messageText
      },
      success: (data) => {
        console.log('********* add message SUCCESS:', data);
        this.setState({
          message: '',
          messages: data
        });
      },
      error: (error) => {
        console.log('********* add message ERROR:', error);
      }
    });
  }

  changeMessage(e) {
    var stateInput = {};
    stateInput[e.target.id] = e.target.value;
    this.setState(stateInput);
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
                  <input id="messageText" className="submitMessageInput" onChange={this.changeMessage.bind(this)}></input>
                  <button onClick={this.addMessage.bind(this)}>Send Message</button>
                </div>
                <br></br>
              </div>
              <div className="row">
                <div className="col">
                  {this.state.messages.map((message, index) => (
                    <MessagesList key={index} message={message} />
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
