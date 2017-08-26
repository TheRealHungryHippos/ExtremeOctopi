import React from 'react';
var classNames = require('classnames');
var date;

const MessagesList = ( props ) => (
  // date = new Date(props.message.createdAt),
  // bubbleClass = classNames({
  //   'talk-bubble': true,
  //   'tri-right': true,
  //   'left-in': props.message.sender === props.friend,
  //   'round': props.message.sender !== props.friend,
  //   'right-in': props.message.sender !== props.friend
  // }),
  <div className="card-text">
    <div className="talk-bubble-right tri-right left-in">
      <div className="talktext">
        <strong>{props.message.sender}&nbsp;:&nbsp;</strong> {props.message.message}
      </div>
    </div>
  </div>
);

export default MessagesList;
// ({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()})
