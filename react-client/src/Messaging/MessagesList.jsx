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

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     classType: nextProps.message.classType,
  //     sender: nextProps.message.sender,
  //     message: nextProps.message.message
  // })
  // }
  componentDidMount() {
    document.getElementById('messageList').scrollTop = document.getElementById('messageList').scrollHeight;
  }

  render() {
    return (
      <div className={this.state.classType.slice(0, 12) + ' row'}>
        <div className={this.state.classType}>
          <div className="talktext card-text">
            <strong>{this.state.sender}&nbsp;:&nbsp;</strong> {this.state.message}
          </div>
        </div>
      </div>
    );
  }
}

export default MessagesList;
// ({date.getMonth()+1}/{date.getDate()}/{date.getFullYear()})
