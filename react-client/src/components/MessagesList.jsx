import React from 'react';

const MessagesList = ( props ) => (
  <div>
  <div className="talk-bubble tri-right left-top">
  <div className="talktext">
    <strong>{props.message.sender}&nbsp;:&nbsp;</strong> {props.message.message}
  </div>
  </div>
  </div>
);

export default MessagesList;