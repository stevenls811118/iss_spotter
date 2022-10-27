const request = require('request-promise-native');

/*
* Requests user's ip address from https://www.ipify.org/
* Input: None
* Returns: Promise of request for ip data, returned as JSON string
*/

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

/* 
* Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
* Input: JSON string containing the IP address
* Returns: Promise of request for lat/lon
*/

const fetchCoordsByIP = (body) => {
  let ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};


const fetchISSFlyOverTimes = (body) => {
  let parsedBody = JSON.parse(body);
  let coords = {
    latitude: parsedBody.latitude,
    longitude: parsedBody.longitude
  };
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(body => {
    let array = JSON.parse(body).response;
    return array;
  });
}
module.exports = { nextISSTimesForMyLocation };