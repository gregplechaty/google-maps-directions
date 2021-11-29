const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const shortestRoute = require("./controllers/shortestRoute");

app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.get('/api/v1/directions/shortest-route/:addresses', shortestRoute.getShortestRoute);