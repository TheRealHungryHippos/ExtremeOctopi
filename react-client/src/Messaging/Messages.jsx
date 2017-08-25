import React from 'react';
import $ from 'jquery';
import MessagesList from './MessagesList.jsx';
import MessageFriendList from './MessageFriendList.jsx';
import MessageFriendSelected from './MessageFriendSelected.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriend: '',
      messages: []
    };
  }

  selectFriend(friend){
    //get mutual friends, then setstate
    this.setState({selectedFriend: friend});
  }

  updateMessages(user, friend) {
    if(user === 'home') {
      $.ajax({
        method: 'GET',
        url: '/messages',
        success: (data) => {
          console.log('updateMessages:', JSON.parse(data).received);

          var data = JSON.parse(data);

          if (data) {
            this.setState({
              messages: data.received
            });
          }
        },
        error: (error) => {
          console.log('ERROR:', error);
        }
      });
    } else {
      $.post('/friendMessages', {username: user, friend: friend}, (data) => {
        if(data) {
          var data = JSON.parse(data);
          // console.log(data.received);
          this.setState ({
            // messages: data.received
          })
        }
      })
    }
  }

  changeMessage( event ) {
    this.setState( { message: event.target.value } );
  }

  onClick() {
    if(this.user === 'home') {
      $.ajax({
        method: 'POST',
        url: '/message',
        data: {
          match: this.user,
          message: this.state.message
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
    } else {
      $.ajax({
        method: 'POST',
        url: '/messageFriend',
        data: {
          username: this.user,
          message: this.state.message
        },
        success: (data) => {
          console.log('Friend:', data);

          this.updateMessages(this.user);
        },
        error: (error) => {
          console.log('ERROR:', error);
        }
      });
    }
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
            <div className="card">
              <h2 className="card-header">Messages</h2>
              <br/>
              <div className="card-block">
              <input onChange={ this.changeMessage.bind( this ) }></input>
              <button onClick={ this.onClick.bind( this ) }>Submit</button>
              <br></br>
              { this.state.messages.map( ( message, index ) => (
                <MessagesList key={ index } message={message}/>
              ) ) }
              <div className="row align-self-end">
                <div className="col-12">
                  <div className="card">
                    <MessageFriendSelected friend={this.state.selectedFriend}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default Messages;
