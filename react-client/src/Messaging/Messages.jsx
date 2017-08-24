import React from 'react';
import $ from 'jquery';
import MessagesList from './MessagesList.jsx';
import FriendList from './FriendList.jsx';
import FriendSelected from './FriendSelected.jsx';

class Messages extends React.Component {
  constructor(props) {
    super(props);

    // var regexp = /^\/Messages\/(.*)\/$/;
    // this.user = props.history.location.pathname.match( regexp )[ 1 ];

    this.state = {
      match: '',
      friend: '',
      message: '',
      messages: []
    };

    // this.updateMessages(this.user);
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
            <h1>Friends</h1>
            <br/>
            <FriendList />
          </div>
          <div className="col-8">
              <h1>Messages</h1>
              <br/>
              <input onChange={ this.changeMessage.bind( this ) }></input>
              <button onClick={ this.onClick.bind( this ) }>Submit</button>
              <br></br>
              { this.state.messages.map( ( message, index ) => (
                <MessagesList key={ index } message={message}/>
              ) ) }
            <div className="row align-self-end">
              <div className="col-8">
                <h1>Friend Selected</h1>
                <br></br>
                <FriendSelected />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Messages;
