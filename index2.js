const { nextISSTimesForMyLocation } = require("./iss_promised");

const printPassTimes = (array) => {
  for (let i of array) {
    let dataFormat = new Date(i.risetime);
    console.log(`Next pass at ${dataFormat} for ${i.duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });