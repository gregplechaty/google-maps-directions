const {Client} = require("@googlemaps/google-maps-services-js");

const client = new Client({});

client  
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      // locations: [{'milwaukee'}, {'chicago'}, {'Beloit'}],
      key: process.env.SECRET_KEY,
    },
    timeout: 5000, // milliseconds
  })
  .then((r) => {
    console.log(r.data.results[0].elevation);
  })
  .catch((e) => {
    console.log(e.response.data.error_message);
  });
















const getShortestRoute = (req, res) => {
  console.log('The request:', req.params['addresses']);
  //create url
  //process.env.SECRET_KEY
  
  const url = constructURL(req.params['addresses']);
  // fetch from Google directions matrix
  console.log('here\'s the url:', url)
  getDirectionMatrix(url)
  return res.json({
    status: 'success',
    message: 'this worked',
    data: {'message': 'this worked', },
    });
}

function constructURL(addresses) {
  let urlBeginning = 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations='
  addressesEncoded = `${encodeURIComponent(addresses)}`;
  let url = urlBeginning + addressesEncoded + '&origins=' + addressesEncoded + '&key=' + process.env.SECRET_KEY
  return url;
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
    .then(async (data) => {
      if (data.exists) {
        console.log(data);
         // const { id, user_id, email } = data.data; // taking values from response, assigning to variables
         // const accesstoken = generateToken(email); // not sure if this is needed
          return res.json({
              status: data.exits,
              //accesstoken: accesstoken,
              //data: { id: id, user_id: user_id, email: email },
          });
      } else {
          return res.json({ status: false, message: "Was unable to retrieve profile information." });
      }
      })
      .catch((err) => console.log(err));
}

  module.exports = {
    getShortestRoute,
  }