import React from 'react';

const EditProfile = ( props ) => (
  <h3>
    <form onSubmit={ props.handleEditProfile } className="form-horizontal">
      <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="name">Name:</label>
        <textarea font-size="18px" cols="50" id="name" value={props.n} name="name" type="text" onChange={ props.handleChange }/>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="location">Location:</label>
        <textarea cols="50" id="location" value={props.l} name="location" type="text" onChange={ props.handleChange }/>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="hobbies">Hobbies:</label>
        <textarea cols="50" id="hobbies" value={props.h} name="hobbies" type="text" onChange={ props.handleChange }/>
      </div>
      <div className="form-group">
        <label className="control-label col-sm-4" htmlFor="about">About Me:</label>
        <textarea cols="50" id="about" value={props.a} name="aboutme" type="text" onChange={ props.handleChange }/>
      </div>
      <div className="form-group">
        <div className="col-sm-offset-5">
          <button type="submit" className="btn btn-default">Edit Profile</button>
        </div>
      </div>
    </form>
  </h3>
)

export default EditProfile