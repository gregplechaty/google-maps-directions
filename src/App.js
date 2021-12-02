
import React, { useState } from 'react';
import AddressInput from "./components/AddressInput/AddressInput.js"
import './App.css';


function App() {
  

  const [locations, setLocations] = useState(['', '', '',]);
  const [message, setMessage] = useState('');
  const [directionsResult, setDirectionsResult] = useState([]);
  const [legNum, setLegNum] = useState(1);

  console.log('what on earth:', directionsResult.length)
  
  const errorMessages = {
    NOT_FOUND: 'At least one location could not be identified.',
    ZERO_RESULTS: 'No route could be found between the origin and destination',
    MAX_ROUTE_LENGTH_EXCEEDED: 'The requested route is too long and cannot be processed. This error occurs when more complex directions are returned. Try reducing the number of waypoints, turns, or instructions.',
    INVALID_REQUEST: 'Invalid request made.',
    OVER_QUERY_LIMIT: 'The webpage has sent too many requests within the allowed time period.',
    REQUEST_DENIED: 'Request Denied. The webpage is not allowed to use the directions service.',
    UNKNOWN_ERROR: 'Your directions request could not be processed due to a server error. The request may succeed if you try again.',
  }
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
      newList.splice(i,1);
      setLocations(newList);
    }
  }

/////////////// One Call, that's all ///////////////

  function calcRoute() {
    const google = window.google;
    let directionsService = new google.maps.DirectionsService();
    const request = {
      origin: locations[0],
      destination: locations[0],
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()), //option later to modify start time
        trafficModel: 'bestguess'
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      waypoints: createWaypoints(locations),
      optimizeWaypoints: true,
      //provideRouteAlternatives: true,
      //avoidFerries: true,
      avoidHighways: false,
      avoidTolls: false,
      //region: String
    };
    
    directionsService.route(request, function(response, status) {
      if (status == 'OK') {
        console.log('response:', response, response.routes[0].legs);
        setDirectionsResult(response.routes[0].legs);
      } else {
        postErrorMessage(status);
      };
    });
  }

  function postErrorMessage(status) {
    if (errorMessages[status]) {
      setMessage(errorMessages[status]);
    } else {
      setMessage('Directions could not be found for an unknown reason.');
    };
  };


  function createWaypoints(locations) {
    let waypoints = [];
    for (let location of locations.slice(1)) {
      waypoints.push({'location': location,})
    };
    return waypoints;
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
      //console.log('distanceData', distanceData)
      const initialCombo = initCombo(distanceData['details']['numOfAddresses']-1)
      //console.log('initialCombo', initialCombo)
      const incompleteRouteCombinations = createRouteCombinations(initialCombo);
      //console.log('routeCombinations', incompleteRouteCombinations)
      const routeCombinations = addZeros(incompleteRouteCombinations)
      //console.log('routeCombinations', routeCombinations)
      const shortestRoute = calcShortestRoute(routeCombinations, distanceData);
      //console.log('shortestRoute', shortestRoute)
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
    <div>
      <h1>Premier Roofing Route Generator</h1>
      <div className="flex-wrap">
        <div className="flex-column">
          <h2>Enter addresses below:</h2>
          {locations.map((location, i) =>(
                <AddressInput 
                location={location}
                onChange={editLocation}
                index={i}
                onDeleteLocation={deleteLocation}
                />
            ))}
          <div className="button button--shadow" 
            onClick={createLocation}>
            <p>Add Destination (up to 6 total)</p>
          </div>
          <div className="button button--shadow"
            onClick={calcRoute}>
            <p>Get Shortest Route!</p>
          </div>
        </div>
        <div className="flex-column">
          <h2>Your optimized route: TODO miles</h2>
          <h5>Click on a leg of your route to show directions:</h5>
          <ol className="leg--list">
            {directionsResult.map((leg, i) => (
                <li className="leg--button button--shadow" onClick={() => setLegNum(i)}>{leg.start_address} --> {leg.end_address} ({leg.distance.text})</li>
            ))}
          </ol>
          <h6>Directions:</h6>
          <div>
            <p>Start: {directionsResult.length > 0 ? directionsResult[legNum].start_address : null }</p>
            <ol>

              {directionsResult.length > 0 ? directionsResult[legNum].steps.map(step => (
                  <li>{step.instructions} ({step.distance.text})</li>
              )) : null}
            </ol> 
            <p>End: {directionsResult.length > 0 ? directionsResult[legNum].end_address : null}</p> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
