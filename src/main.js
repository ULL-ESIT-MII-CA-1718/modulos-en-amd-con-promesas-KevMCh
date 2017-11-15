define = require(__dirname + "/amd.js");

define(["day-name"], function(weekDay) {
  console.log(weekDay.name(3));
});
