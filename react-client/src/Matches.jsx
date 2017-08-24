import EditProfile from './components/EditProfile.jsx';
import MatchesList from './components/MatchesList.jsx';
import ImageUpload from './components/UploadPic.jsx';
import React from 'react';

class Matches extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div className="matches">
        <h3>Send some friend requests!</h3>
        <MatchesList matches={ this.props.matches } />
      </div>
    )
  }
}

export default Matches