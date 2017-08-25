import React from 'react';
var date;

const MessagesList = ( props ) => (
  date = new Date(props.message.createdAt),
  <div className="card-text">
    <div className="talk-bubble tri-right left-top">
      <div className="talktext">
        <strong>{props.message.sender}&nbsp;({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()}):&nbsp;</strong> {props.message.message}
      </div>
    </div>
  </div>
);

export default MessagesList;
