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

    <div className={props.message.classType}>
      <div className="talktext card-text">
        <strong>{props.message.sender}&nbsp;:&nbsp;</strong> {props.message.message}
      </div>
    </div>

);

export default MessagesList;
// ({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()})
