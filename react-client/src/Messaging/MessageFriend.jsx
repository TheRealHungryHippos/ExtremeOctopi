import React from 'react';

const MessageFriend = ( props ) => (
    <li className="messageFriendRow">
      <img className="friendPic img-fluid" src={props.profile.profile_img}/>
      <div>
        <a href="#" onClick={()=> {props.selectFriend(props.profile)}}><b>{props.profile.username}</b></a>
      </div>
    </li>
);

export default MessageFriend;
