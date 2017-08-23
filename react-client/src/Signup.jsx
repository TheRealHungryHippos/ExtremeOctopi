import React from 'react';
import $ from 'jquery';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: '',
      email: '',
      username: '',
      password: '',
      img: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: target.value
    });


  }

  handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      url: '/signup',
      method: 'POST',
      data: {
        fullname: this.state.fullname,
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        img: 'https://s-media-cache-ak0.pinimg.com/originals/36/43/e7/3643e7e8dab9b88b3972ee1c9f909dea.jpg'
      },
      success: (data) => {
        this.props.history.push('/Test');
      },
      error: (error) => {
        console.log('ERROR:', error);
      }
    });
  }

  render() {
    return (
      <div className="signUpIn">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <label>
            Full Name:
            <input
              size="35"
              className="form-control"
              required
              autoFocus=""
              name="fullname"
              type="text"
              onChange={this.handleInputChange}/>
          </label>
          <label>
            E-mail:
            <input
              size="35"
              className="form-control"
              required
              autoFocus=""
              name="email"
              type="text"
              onChange={this.handleInputChange}/>
          </label>
          <label>
            Username:
            <input
              size="35"
              className="form-control"
              required
              autoFocus=""
              name="username"
              type="text"
              onChange={this.handleInputChange}/>
          </label>
          <label>
            Password:
            <input
              size="35"
              className="form-control"
              required
              autoFocus=""
              name="password"
              type="password"
              onChange={this.handleInputChange}/>
          </label>
          <button className="button btn btn-lg btn-primary btn-block" type="submit">Sign Me Up!</button>
        </form>
      </div>

    )
  }
}

export default Signup