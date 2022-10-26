const {nextISSTimesForMyLocation} = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  // success, print out the deets!
  console.log(passTimes);
});