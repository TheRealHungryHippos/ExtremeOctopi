import React from 'react';

const MessageFriend = ( props ) => (
    <li className="messageFriendRow">
      <img className="friendPic pb-2 pr-2" src={props.profile.profile_img}/>
      <div>
        <a href="#"><b>{props.profile.username}</b></a>
      </div>
    </li>
);

export default MessageFriend;

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
