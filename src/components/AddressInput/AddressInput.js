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
            placeholder={props.index === 0 ? 'Start/End Location'  : 'Stop'}
            value={props.location}
            onChange={(ev) => props.onChange(ev, props.index)}
        />
      </div>
      {props.index > 1 ? 
        <div className="deleteButton button--shadow" onClick={() => props.onDeleteLocation(props.index)}>
        < div className="deleteButton-text">X</div>
        </div>
      : null}
      
    </div>
  );
}

export default AddressInput;
