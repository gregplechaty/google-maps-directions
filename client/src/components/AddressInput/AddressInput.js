import React from 'react';
import './AddressInput.css';


function AddressInput(props) {
  
  return (
    <div className="input" key={props.location.id}>
        <label className="form-label">{props.location.id}</label>
        <input 
          className="form-content"
          name={props.location.id}
          type="text"
          placeholder="Start/End Location"
          value={props.location.address}
          onChange={(ev) => props.onChange(ev, props.index, 'address')}
        />
        <div className="deleteButton" onClick={() => props.onDeleteLocation(props.index)}>
          <div className="deleteButton-text">X</div>
        </div>
    </div>
  );
}

export default AddressInput;
