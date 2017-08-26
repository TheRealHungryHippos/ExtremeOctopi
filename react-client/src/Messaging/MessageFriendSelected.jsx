import React from 'react';
var friendHeading;

const MessageFriendSelected = ( props ) => (
  friendHeading = props.mutualFriends.length > 0 ? 'Mutual Friends' : '',
  props.friend ?
  <div className="friendSelected">
    <br></br>
    <div>
      <input id="messageText" className="submitMessageInput" onChange={props.changeMessage}></input>
      <button onClick={props.addMessage}>Send Message</button>
    </div>
    <br></br>
    <h2 className="card-header friend">{props.friend.username}
      <button className="blockButton button btn btn-md btn-primary " id={props.friend.username + ',block'} onClick={props.updateMatches}>Block User</button>
    </h2>
    <br/>
    <div className="card-block">
      <div className="row">
        <div className="card-text col-8">
          <img className="friendPic mr-2" src={props.friend.profile_img}/>
          {props.friend.fullname}
          <br />
          {props.friend.about_me}
          <br />
          <a href={props.friend.twitter_url}>{props.friend.twitter_url}</a>
          <br></br>
        </div>
        <div className="col-4">
          <b>{friendHeading}</b>
          <br/>
          {props.mutualFriends.map(friend => {
            return <img key={friend._id} src={friend.profile_img} height="30" width="30" />
          })}
        </div>
      </div>
    </div>
  </div>
  :
  <div className="col">
    <h5 className="card-header">Select a Friend to Start a Chat</h5>
    <br/>
    <div className="card-block row">
      <div className="card-text col">
      </div>
    </div>
  </div>

);

export default MessageFriendSelected;

//sample data:
// { _id: 599f599eaf279f212cd38d0f,
//     twitter_id: '24680',
//     username: 'CorinneOly',
//     twitter_url: 'https://twitter.com/CorinneOly',
//     fullname: 'Corinne olympios',
//     profile_img: 'https://pbs.twimg.com/profile_images/795698272262377472/lK9J59o1_400x400.jpg',
//     about_me: 'Bachelor 21 • insta- Colympios • Corninquiries@gmail.com',
//     pending_request: [],
//     pending_approval: [ '54321' ],
//     blocked: [],
//     friends: [ '13579' ],
//     following: [],
//     matches: [ '09876', '12345' ] }
