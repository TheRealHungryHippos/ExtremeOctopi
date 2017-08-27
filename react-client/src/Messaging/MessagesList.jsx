import React from 'react';
var date;

class MessagesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classType: props.message.classType,
      sender: props.message.sender,
      message: props.message.message
    };
  }

  componentDidMount() {
    document.getElementById('messageList').scrollTop = document.getElementById('messageList').scrollHeight;
  }

  render() {
    return (
      <div className={this.props.message.classType.slice(0, 12) + ' row'}>
        <div className={this.props.message.classType}>
          <div className="talktext card-text">
            <strong>{this.props.message.sender}&nbsp;:&nbsp;</strong> {this.props.message.message}
          </div>
        </div>
      </div>
    );
  }
}

export default MessagesList;
// ({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()})
