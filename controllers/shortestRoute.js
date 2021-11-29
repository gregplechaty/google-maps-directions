const getShortestRoute = (req, res) => {
  console.log('The request:', req.params['addresses']);
  //create url
  // fetch from Google directions matrix
  return res.json({
    status: 'success',
    message: 'this worked',
    data: {'message': 'this worked', },
    });

}

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

  module.exports = {
    getShortestRoute,
  }