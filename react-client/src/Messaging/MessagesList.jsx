import React from 'react';
var classNames = require('classnames');
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

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     classType: nextProps.message.classType,
  //     sender: nextProps.message.sender,
  //     message: nextProps.message.message
  // })
  // }

  render() {
    return (
      <div className={this.state.classType}>
        <div className="talktext card-text">
          <strong>{this.state.sender}&nbsp;:&nbsp;</strong> {this.state.message}
        </div>
      </div>
    );
  }
}

export default MessagesList;
// ({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()})
