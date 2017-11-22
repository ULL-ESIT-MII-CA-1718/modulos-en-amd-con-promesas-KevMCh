var should = require('should');
var assert = require('better-assert');

describe("Modules", function() {
  describe("AMD", function() {
    define = require("../src/amd.js");

    it("Day by number", function() {
      define([__dirname+"/../src/day-name"], function(weekDay) {
        assert(weekDay.name(6) === "Saturday");
      });
    });

    it("Number of the day", function() {
      define([__dirname+"/../src/day-name"], function(weekDay) {
        assert(weekDay.number("Sunday") === 0);
      });
    });
  });
});
