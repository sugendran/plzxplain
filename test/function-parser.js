var parser = require('../src/parser');
var getLocation = require('./helpers/parser-helpers').getLocation;

describe('function things: ', function() {
  it('can call a function', function() {
    var input = 'alert("hi")';
    var expected = [{
      type: "subroutinecall",
      action: "CALL SUBROUTINE `alert` WITH ARGUMENTS 'hi'",
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 1,
          column: 11
        }
      }
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('can call a function', function() {
    var input = 'console.log("hi")';
    var expected = [{
      type: "subroutinecall",
      action: "CALL SUBROUTINE `console`.`log` WITH ARGUMENTS 'hi'",
      loc: {
        start: {
          line: 1,
          column: 0
        },
        end: {
          line: 1,
          column: 17
        }
      }
    }];
    expect(parser(input)).toEqual(expected);
  });
});