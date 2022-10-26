const {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes} = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work! " , error);
    return;
  }
  console.log('It worked! Returned IP:' , ip);
});

// -----------------------------------------------

const ip = "184.64.118.184";

fetchCoordsByIP(ip, (error, data) => {
  if (error) {
    console.log("There is an error! " , error);
    return;
  }
  console.log('It worked! Returned coordinates:' , data);
});

//------------------------------------------------

const coords = {
  latitude: 51.0486151,
  longitude: -181.0708459
};
const inspect = require('util').inspect;

fetchISSFlyOverTimes(coords, (error, data) => {
  if (error) {
    console.log("There is an error! ", error);
    return;
  }
  console.log(`It worked! Returned a list of flyover time: ${inspect(data)}`);
});