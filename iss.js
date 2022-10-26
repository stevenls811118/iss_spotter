/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`, null);
      return;
    }
    let ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (parsedBody.success === false) {
      callback(`Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`, null);
      return;
    }

    let coordinates = {};
    coordinates.latitude = parsedBody.latitude;
    coordinates.longitude = parsedBody.longitude;
    callback(null, coordinates);
  });
};

/**
* Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
* Input:
*   - An object with keys `latitude` and `longitude`
*   - A callback (to pass back an error or the array of resulting data)
* Returns (via Callback):
*   - An error, if any (nullable)
*   - The fly over times as an array of objects (null if error). Example:
*     [ { risetime: 134564234, duration: 600 }, ... ]
*/
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (err, response, body) => {

    if (err) {
      callback(err, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(`Status Code ${response.statusCode} when fetching ISS fly over times. Response: ${body}`, null);
      return;
    }

    let parseinfo = JSON.parse(body);
    callback(null, parseinfo.response);
  });
};

/**
* Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
* Input:
*   - A callback with an error or results.
* Returns (via Callback):
*   - An error, if any (nullable)
*   - The fly-over times as an array (null if error):
*     [ { risetime: <number>, duration: <number> }, ... ]
*/

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work! " , error);
      return;
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("There is an error! " , error);
        return;
      }

      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          console.log("Error found! ", error);
          return;
        }
        
        let passTimes = "";
        for (let i of data) {
          let dataFormat = new Date(i.risetime);
          passTimes += `Next pass at ${dataFormat} for ${i.duration} seconds!\n`;
        }
        callback(null, passTimes);
      });
    });
  });
};

module.exports = {nextISSTimesForMyLocation};