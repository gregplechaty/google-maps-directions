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

  function calculateShortestRoute() {
    console.log('calc shortest route');
    const url = constructURL(locations);
    //console.log(url);
    //fetch
    getDirectionMatrix(url);


    // data into graph representation

    // graph impl.


  };

/////////////////////////// WORKING HERE /////////////////////////

  function getShortestRoute() {
    console.log('function: getShortestRoute')
    //const csrftoken = getCookie('csrftoken');
    fetch('/api/v1/directions/shortest-route/' + constructURLAddresses(locations), {
        method: "GET",
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'include',
        headers: {
            //'X-CSRFToken': csrftoken,
            "Content-Type": "application/json",
        },
        referrerPolicy: 'no-referrer',
        //body: locations,
        })
    .then(function (response) {
        console.log(response);
        //if (response['status'] == 200) {setloggedIn(true);}
      })
      .catch(function (error) {
        console.log('Here\s the error:', error);
      });
}







  function constructURL(locations) {
    let urlBeginning = 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations='
    let addresses = constructURLAddresses(locations);
    let url = addresses + '&origins=' + addresses + '&key='
    return addresses;
  };

  function constructURLAddresses(locations) {
    let addresses = '';
    for (let index in locations) {
      if (locations[index]['id'] !== 'start') {
        addresses = addresses + '|';
      }
      addresses = addresses + `${encodeURIComponent(locations[index]['address'])}`;
    };
    return addresses;
  };
  
  function getDirectionMatrix(url) {
    console.log('function: getDirectionMatrix', url)
    //url = 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=Waukesha%2C%20WI|pewaukee%2C%20wi|milwaukee%2C%20wi&origins=Waukesha%2C%20WI|pewaukee%2C%20wi|milwaukee%2C%20wi&key=AIzaSyDjxX0fJy0Dr82LjZdOoyyb7US3XgXwECs';
    fetch(url, {
      method: "GET",
      // 'Access-Control-Allow-Origin': 'http://localhost:3000/',
      // mode: 'cors',
      //cache: 'no-cache',
      //credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '',
        "Content-Type": "application/json",
    },


      //referrerPolicy: 'no-referrer',
      //body: activityPost,
      })
    .then((r) => r.json())
    .then((data) => {
        console.log('Got data from the Google gods!');
        console.log('Here\'s data', data);

    } )
    .catch((e) => console.log('Boo! Something went wrong.'));
  }

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
        onClick={getShortestRoute}>
        Get Shortest Route!
      </div>
      </div>
      
      <div className="flex-column">

      </div>
    </div>
  );
}

export default App;

/*
class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;

*/