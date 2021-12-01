
import React, { useState } from 'react';
import AddressInput from "./components/AddressInput/AddressInput.js"
import './App.css';


function App() {
  
  const [locations, setLocations] = useState([
    {
      id: 'start',
      address: '',
    },
    {
      id: 1,
      address: '',
    },
    {
      id: 2,
      address: '',
    },
  ]);
  /////////////// Location functions ///////////////

  function createLocation() {
    if (locations.length < 7) {
      setLocations([
        ...locations,
        {
          id: locations[locations.length-1]['id']+1,
          address: '',
        },
      ]);
    };
  };
  function editLocation(ev, index, key) {
    // console.log('editLocation:', ev, index, key)
    const {name, value} = ev.target;
    let newList = [...locations]
    newList[index][key] = value;
    setLocations(newList);
  }
  function deleteLocation(i) {
    if (locations.length > 3) {
      let newList = [...locations]
      newList.splice(i,1);
      setLocations(newList);
    }
  }


/////////////// Mother Function ///////////////

  function generateShortestRouteDirections() {
    console.log('calc shortest route');
    getDirectionMatrixData()
    //.then(console.log('dataMatrix:', dataMatrix))
    // data into graph representation
    // graph impl.

  };

/////////////// Getting Data ///////////////

function getDirectionMatrixData() {
  const google = window.google;
  const locationList = createLocationList(locations);
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: locationList,
      destinations: locationList,
      travelMode: 'DRIVING',
      //transitOptions: TransitOptions,
      //drivingOptions: DrivingOptions,
      //unitSystem: UnitSystem,
      //avoidHighways: Boolean,
      //avoidTolls: Boolean,
    }, callback)
    .then(console.log('take 1000:', result))
    function callback(response, status) {
      if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        let distancesOnlyMatrix = [];
        for (var i = 0; i < origins.length; i++) {
          var results = response.rows[i].elements;
          let tempArray = [];
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            var distance = element.distance.text;
            tempArray.push(distance);
            var duration = element.duration.text;
            console.log('distance:', distance);
            var from = origins[i];
            var to = destinations[j];
          }
          distancesOnlyMatrix.push(tempArray);
        }
        //setDistanceMatrixData(results);
        console.log(distancesOnlyMatrix);
        return distancesOnlyMatrix;
      } else {
        console.log('status is not OK. status = ', status);
      }
    }
    
    
};

  function createLocationList(locations) {
    let locationList = [];
    for (let location of locations) {
      locationList.push(location['address']);
    };
    return locationList;
  };

function callback(response, status) {
  //console.log('results:', response)
  if (status == 'OK') {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    let distancesOnlyMatrix = [];
    let tempArray = [];
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        tempArray.push(distance);
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];
      }
      distancesOnlyMatrix.push(tempArray);
    }
    //setDistanceMatrixData(results);
    return distancesOnlyMatrix;
  } else {
    console.log('status is not OK. status = ', status);
  }
}

/////////////// Create Data Matrix ///////////////




// some global variable to store the results
var result = []

// currentSize should be invoked with the array size
function permutation(arr, currentSize) {
    if (currentSize == 1) { // recursion base-case (end)
        result.push(arr.join(""));
        return result;
    }
    
    for (let i = 0; i < currentSize; i++){
        permutation(arr, currentSize - 1);
        if (currentSize % 2 == 1) {
            let temp = arr[0];
            arr[0] = arr[currentSize - 1];
            arr[currentSize - 1] = temp;
        } else {
            let temp = arr[i];
            arr[i] = arr[currentSize - 1];
            arr[currentSize - 1] = temp;
        }
    }
    
}

  const array = [1,2];



// use result here

  

      

  

  ////////////////////////// Example distanceObject

  let distanceObject = {
    0: {
        name: 'waukesha, wi',
        distances: [0, 6074, 31087]
    },
    1: {
        name: 'pewaukee, wi',
        distances: [6938, 0, 28446]
    },
    2: {
        name: 'milwaukee, wi',
        distances: [31375, 28792, 0]
    },
}


let distanceArray = [
    [0, 6074, 31087],
    [6938, 0, 28446],
    [31375, 28792, 0]
]

////////////////////////// Example initial array, and set of combinations
const exampleArray = [1,2,3];
const comboArrays = [
    [0,1,2,3,0],
    [0,1,3,2,0],
    [0,2,1,3,0],
    [0,2,3,1,0],
    [0,3,1,2,0],
    [0,3,2,1,0],
]

////////////////////////// function to calculate shoretest route

//console.log(distanceObject[i+1][i])
function calcShortestRoute(comboArrays) {
  let tempSum = 0;
  let tempDistance = 0;
  let minDistance = Math.pow(10, 1000);
  let minDistanceCombo = [];
  for (let combo of comboArrays) {
      tempSum = 0;
      for (let i=0; i<combo.length-1; i++) {
          tempDistance = tempDistance + distanceObject[combo[i]['distances'][i+1]];
      }
      if (tempDistance < minDistance) {
          minDistance = tempDistance;
          minDistanceCombo = combo;
      }
      
  }
}

// return array of location names
  return (
    <div className="flex-wrap">
      <div className="flex-column">

      {locations.map((location, i) =>(
                      <AddressInput 
                      location={location}
                      onChange={editLocation}
                      index={i}
                      onDeleteLocation={deleteLocation}
                    />
                  ))}
      <div className="submitButton" 
        onClick={createLocation}>
        Add Destination
      </div>
      <div className="submitButton"
        onClick={generateShortestRouteDirections}>
        Get Shortest Route!
      </div>
      </div>
      
      <div className="flex-column">

      </div>
    </div>
  );
}

export default App;
