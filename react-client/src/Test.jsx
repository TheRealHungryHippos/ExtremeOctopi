import React from 'react';
import $ from "jquery";

class Test extends React.Component {
  constructor( props ) {
    super( props );
  }

  handleSubmit( event ) {
    event.preventDefault();

    var parameters = {
      testResults: event.target.personalityTest.value.toLowerCase()
    };

    $.post( '/test', parameters, () => {
      this.props.history.push( '/Profile/home/' );
    } );
  }

  render() {
    return (
      <div className="test">
        <div className="row">
          <h1 className="center">Personality Quiz
          </h1>
        </div>
        <div className="center">
          <h3>
          <a href="https://www.16personalities.com/free-personality-test" target="_blank">Take the test</a>
          </h3>
        </div>
        <br/>
        <br/>
        <br/>
        <div className="center">
          <form onSubmit={ this.handleSubmit.bind( this ) }>
            Your test result:&nbsp;&nbsp;
            <input required type="text" name="personalityTest" placeholder="e.g. entj"></input>
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Test