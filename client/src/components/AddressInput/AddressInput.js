import React from 'react';
import './AddressInput.css';


function AddressInput(props) {
  
  return (
    <div className="input" key={props.location.id}>
      <div className="input-label">
        {props.index === 0 ?
        <label>Start</label>
        : <label>{props.index}</label>
        }
        
      </div>
      <div className="input-textField">
        <input 
            className="form-content"
            name={props.location}
            type="text"
            placeholder="Start/End Location"
            value={props.location}
            onChange={(ev) => props.onChange(ev, props.index)}
        />
      </div>
      {props.index > 2 ? 
        <div className="deleteButton" onClick={() => props.onDeleteLocation(props.index)}>
        < div className="deleteButton-text">X</div>
        </div>
      : null}
      
    </div>
  );
}

export default AddressInput;
