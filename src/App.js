
import React, { useState } from 'react';
import AddressInput from "./components/AddressInput/AddressInput.js"
import './App.css';


function App() {
  
  const [locations, setLocations] = useState(['', '', '',])

  /////////////// Location functions ///////////////

  function createLocation() {
    if (locations.length < 7) {
      setLocations([...locations, '',]);
    };
  };

  function editLocation(ev, index) {
    const {name, value} = ev.target;
    let newList = [...locations]
    newList[index] = value;
    setLocations(newList);
  }
  function deleteLocation(i) {
    if (locations.length > 3) {
      let newList = [...locations]
      console.log(newList);
      newList.splice(i,1);
      console.log(newList);
      setLocations(newList);
    }
  }

/////////////// Primary Function ///////////////

  function generateShortestRouteDirections() {
    const google = window.google;
    const locationList = createLocationList(locations);
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: locationList,
        destinations: locationList,
        travelMode: 'DRIVING',
        //unitSystem: google.maps.UnitSystem.IMPERIAL,
      })
    .then(response => {
      const distanceData = createDistanceData(response);
      console.log('distanceData', distanceData)
      const initialCombo = initCombo(distanceData['details']['numOfAddresses']-1)
      console.log('initialCombo', initialCombo)
      const incompleteRouteCombinations = createRouteCombinations(initialCombo);
      console.log('routeCombinations', incompleteRouteCombinations)
      const routeCombinations = addZeros(incompleteRouteCombinations)
      console.log('routeCombinations', routeCombinations)
      const shortestRoute = calcShortestRoute(routeCombinations, distanceData);
      console.log('shortestRoute', shortestRoute)
    })   
  };

  function createLocationList(locations) {
    let locationList = [];
    for (let location of locations) {
      locationList.push(location);
    };
    return locationList;
  };


  function createDistanceData(response) { /// Create Data Matrix ///
    var origins = response.originAddresses;
    let distanceData = {};
    distanceData['details'] = {};
    distanceData['details']['numOfAddresses'] = origins.length;
    for (let i = 0; i < origins.length; i++) {
      distanceData[i] = {};
      distanceData[i]['address'] = origins[i];
      let tempArray = [];
      for (let j = 0; j < response.rows[i].elements.length; j++) {
        var distance = response.rows[i].elements[j].distance.value;
        tempArray.push(distance);
        console.log('distance:', distance);
      }
      distanceData[i]['distances'] = tempArray;
    }
    //console.log('lookie here:', distanceData)
    return distanceData;
  }

  function initCombo(num) {
    const range = Array.from({length: num}, (_, i) => i + 1);
    return range;
  }

  function createRouteCombinations(array) { // Create all route combinations
    if (array.length === 2) {
        return [
            [array[0], array[1],],
            [array[1], array[0],],
        ];
    }
    const arrOfArrs = createRouteCombinations(array.slice(1)); //chop off first item in array, use rest
    let routeCombinations = [];
    let tempArray = [];
    for (let arr of arrOfArrs) {
      for (let i=0; i<array.length; i++) {
          tempArray = [...arr.slice(0,i), array[0], ...arr.slice(i)];
          routeCombinations.push(tempArray)
      }
    }
    return routeCombinations;
  }

  function addZeros(combos) {
    let newComboList = [];
    for (let combo of combos) {
      newComboList.push([0, ...combo, 0]);
    }
    return newComboList;
  };

  function calcShortestRoute(comboArrays, distanceObject) {
    let distanceSum = 0;
    let minDistance = Math.pow(10, 1000);
    let minDistanceCombo = [];
    for (let combo of comboArrays) {
      distanceSum = 0;
        for (let i=0; i<combo.length-1; i++) {
          distanceSum = distanceSum + distanceObject[combo[i]]['distances'][combo[i+1]];
        }
        if (distanceSum < minDistance) {
            minDistance = distanceSum;
            minDistanceCombo = combo;
        }
    }
    return minDistanceCombo;
  } 


  ////////////////////////// Example distanceObject (temporary)

  let distanceObject = {
    details: {
      numOfAddresses: 3,
    },
    0: {
        name: 'waukesha, wi',
        distances: [0, 6074, 31087, 9978]
    },
    1: {
        name: 'pewaukee, wi',
        distances: [6938, 0, 28446, 9281]
    },
    2: {
        name: 'milwaukee, wi',
        distances: [31375, 28792, 0, 2872]
    },
    3: {
      name: 'new berlin, wi',
      distances: [31375, 28792, 3432, 0]
  },
}

////////////////////////// Example initial array, and set of combinations (temporary)
const exampleArray = [1,2,3];
const comboArrays = [
    [0,1,2,3,0],
    [0,1,3,2,0],
    [0,2,1,3,0],
    [0,2,3,1,0],
    [0,3,1,2,0],
    [0,3,2,1,0],
]

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
///////////////////////////////////////////////////////////////


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
        <div className="button" 
          onClick={createLocation}>
          <p>Add Destination</p>
          <p>(up to 6)</p>
        </div>
        <div className="button"
          onClick={generateShortestRouteDirections}>
          Get Shortest Route!
        </div>
      </div>
      <div className="flex-column">
        {/* This is where results need to be presented */}
      </div>
    </div>
  );
}

export default App;
