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
        <div className="matchesHeading"><h3 className="matchesHeadingText">Message A Friend <u>or</u> Pass to see New Matches!</h3></div>
        <MatchesList matches={ this.props.matches } updateMatches={this.props.updateMatches}/>
      </div>
    )
  }
}

export default Matches
