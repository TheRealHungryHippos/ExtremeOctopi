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
        <h3 className="matchesHeading">Send messages, or pass on matches and will give you new ones!</h3>
        <MatchesList matches={ this.props.matches } updateMatches={this.props.updateMatches}/>
      </div>
    )
  }
}

export default Matches