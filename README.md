# Google Maps - Calculate most efficient route

This program will take a start/end location, and up to 6 stops, and calculate the quickest route between all points, starting and ending at the same spot.

## Getting Started
- Clone the repository locally.
- Separately, get an API key for Google Maps.
    - If you don't have one, [check this page](https://developers.google.com/maps/documentation/javascript/get-api-key) for how to set up an account and get a key.
    - You'll need to make sure the key is enabled for the following APIs:
        - Directions API
        - Distance Matrix API
- Open up /public/index.index. CTRL+F for "YOUR_API_KEY", and replace this text with your key.
- in the root directory, run `npm install` to get all packages.
- in the root directory, run `npm run start` to start the program.

## Using the route calculator

- To add stops along the route, click the "Add Destination" button. They can be deleted if you don't need them; avoid submitting requests with blank or invalid addresses.
- The app defaults to optimizing by driving time (at the time the request is submitted). Change to "distance" if you want directions optimized purely by distance.
- Generate directions by clicking 'Get Shortest Route!'
- Once directions are generated, click on the pink buttons to toggle directions between legs of your journey.
- Currently all directions assume you are driving.

## API's used:
##### Courtsey of Google Maps API services
- Optimize by driving time: and calculate directions: [Directions Service](https://developers.google.com/maps/documentation/javascript/directions)
- Optimze by Distance: [Distance Matrix Service](https://developers.google.com/maps/documentation/javascript/distancematrix)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).