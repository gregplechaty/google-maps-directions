
import React, { useState, useEffect } from 'react';
import AddressInput from "./components/AddressInput/AddressInput.js"
import './App.css';


function App() {
  

  const [locations, setLocations] = useState(['', '', '',]);
  const [message, setMessage] = useState();
  const [directionsResult, setDirectionsResult] = useState([]);
  const [legNum, setLegNum] = useState(0);
  const [optimizeSetting, setOptimizeSetting] = useState('Driving Time');
  
  const errorMessages = {
    NOT_FOUND: 'At least one location could not be identified.',
    ZERO_RESULTS: 'No route could be found between the origin and destination',
    MAX_ROUTE_LENGTH_EXCEEDED: 'The requested route is too long and cannot be processed. This error occurs when more complex directions are returned. Try reducing the number of waypoints, turns, or instructions.',
    INVALID_REQUEST: 'Invalid request made.',
    OVER_QUERY_LIMIT: 'The webpage has sent too many requests within the allowed time period.',
    REQUEST_DENIED: 'Request Denied. The webpage is not allowed to use the directions service.',
    UNKNOWN_ERROR: 'Your directions request could not be processed due to a server error. The request may succeed if you try again.',
  }
  /////////////// Location CRUD functions ///////////////

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

  function postErrorMessage(status) {
    if (errorMessages[status]) {
      setMessage(errorMessages[status]);
    } else {
      setMessage('Directions could not be found for an unknown reason.');
    };
  };


/////////////// Primary Functions ///////////////

  function controller(locations) {
    if (optimizeSetting === 'Distance') {
      generateShortestRouteDirections();
    } else {
      calcRoute(locations);
    };
  };

  function calcRoute(locations) {
    const google = window.google;
    let directionsService = new google.maps.DirectionsService();
    const optimizeWaypointsYN = optimizeMethod(optimizeSetting);
    const directionsWaypoints = createWaypoints(locations);
    const request = {
      origin: locations[0],
      destination: locations[0],
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(Date.now()), //option later to modify start time
        trafficModel: 'bestguess'
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      waypoints: directionsWaypoints,
      optimizeWaypoints: true,
      //provideRouteAlternatives: true,
      //avoidFerries: true,
      avoidHighways: false,
      avoidTolls: false,
      //region: String
    };
    
    directionsService.route(request, function(response, status) {
      if (status !== 'OK') {
        postErrorMessage(status);
      } else {
        setMessage();
        setDirectionsResult(response.routes[0].legs);
      };
    });
  }

  function generateShortestRouteDirections() {
    const google = window.google;
    const locationList = createLocationList(locations);
    var service = new google.maps.DistanceMatrixService();
    const request = {
      origins: locationList,
      destinations: locationList,
      travelMode: 'DRIVING',
    };
    service.getDistanceMatrix(request, function(response, status) {
      if (status !== 'OK') {
        postErrorMessage(response, status)
      } else {
        if (lookForErrors(response) !== "OK") {
          return;
        };
        setMessage();
        const distanceData = createDistanceData(response);
        const initialCombo = initCombo(distanceData['details']['numOfAddresses']-1);
        const incompleteRouteCombinations = createRouteCombinations(initialCombo);
        const routeCombinations = addZeros(incompleteRouteCombinations);
        const shortestRoute = calcShortestRoute(routeCombinations, distanceData);
        const locationsByDistance = [];
        for (let index of shortestRoute.slice(0,shortestRoute.length-1)) {
          locationsByDistance.push(locations[index]);
        };
        calcRoute(locationsByDistance);
      };
    });
  }

  function lookForErrors(response) {
    for (let object of response.rows) {
      for (let element of object.elements) {
        if (element.status !== "OK") {
          setMessage(element.status);
          return;
        }
      }
    }
    return 'OK';
  }
/////////////// Helper Functions ///////////////


  function optimizeMethod(optimizeSetting) {
    let optimizeWaypointsYN = true;
    if (optimizeSetting === 'Distance') {
      optimizeWaypointsYN = false;
    };
    return optimizeWaypointsYN;
  };

  function createWaypoints(locations) {
    let waypoints = [];
    for (let location of locations.slice(1)) {
      waypoints.push({'location': location,})
    };    
    return waypoints;
  }

  function computeTotalDistance(directionsResult) {
    let total = 0;
    for (let i = 0; i < directionsResult.length; i++) {
      total += directionsResult[i].distance.value;
    }
    total = total / 1609;
    total = Math.round((total + Number.EPSILON) * 100) / 100
    return total;
  }

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
      };
      distanceData[i]['distances'] = tempArray;
    };
    return distanceData;
  }

  function initCombo(num) {
    const range = Array.from({length: num}, (_, i) => i + 1);
    return range;
  }

  function createRouteCombinations(array) { // Create all route combinations recursively
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
    };
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
        };
        if (distanceSum < minDistance) {
            minDistance = distanceSum;
            minDistanceCombo = combo;
        };
    };
    return minDistanceCombo;
  } ;
  
  const totalDistance = computeTotalDistance(directionsResult);
///////////////////////////////////////////////////////////////

  return (
    <div>
      <h1>Premier Roofing Route Generator</h1>
      <div className="flex-wrap">
        <div className="flex-column">
          <h2>Enter addresses below:</h2>
          <div className="dropdown--optimize">
            <legend className="dropdown--optimize--child">Optimize by:</legend>
              <select name="optimize" className="dropdown--optimize--child"
                value={optimizeSetting}
                onChange={(ev) => setOptimizeSetting(ev.target.value)}
              >
                <option>Driving Time</option>
                <option>Distance</option>
              </select>
          </div>
          
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
            onClick={() => controller(locations)}>
            <p>Get Shortest Route!</p>
          </div>
        </div>
        <div className="flex-column">
          {totalDistance !== 0 ? <h2>Your optimized route: {totalDistance}</h2> 
          : <h2>Directions will appear below</h2> }
          { message ? <p className="errorMessage">{message}</p> : null}
          
          <h5>Click on a leg of your route to show directions:</h5>
          <ol className="leg--list">
            {directionsResult.map((leg, i) => (
                <li key = {leg.start_address} className="leg--button button--shadow" onClick={() => setLegNum(i)}>{leg.start_address} --> {leg.end_address} ({leg.distance.text})</li>
            ))}
          </ol> 
          <h6>Directions:</h6>
          <div>
            <p>Start: {directionsResult.length > 0 ? directionsResult[legNum].start_address : null }</p>
            <ol>

              {directionsResult.length > 0 ? directionsResult[legNum].steps.map(step => (
                  <li key={step.start_location + step.distance}>{step.instructions.replace(/<[^>]*>?/gm, '')} ({step.distance.text})</li>
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
