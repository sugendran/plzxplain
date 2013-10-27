var parser = require('../src/parser');
var getLocation = require('./helpers/parser-helpers').getLocation;

describe('statements: ', function() {
  it('does simple variable declaration', function() {
    var input = 'count=0';
    var expected = [{
      type: "statement",
      action: "SET `count` = 0",
      loc: getLocation(1, 0, 1, 7)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does variable incrementation', function() {
    var input = 'a++';
    var expected = [{
      type: "statement",
      action: "SET `a` = `a` + 1",
      loc: getLocation(1, 0, 1, 3)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does variable incrementation the other way', function() {
    var input = '++a';
    var expected = [{
      type: "statement",
      action: "SET `a` = `a` + 1",
      loc: getLocation(1, 0, 1, 3)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('variable equals another variable', function() {
    var input = 'a=b';
    var expected = [{
      type: "statement",
      action: "SET `a` = `b`",
      loc: getLocation(1, 0, 1, 3)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does variable incrementation by n', function() {
    var input = 'a += 2';
    var expected = [{
      type: "statement",
      action: "SET `a` = `a` + 2",
      loc: getLocation(1, 0, 1, 6)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does variable decrement by n', function() {
    var input = 'a -= 2';
    var expected = [{
      type: "statement",
      action: "SET `a` = `a` - 2",
      loc: getLocation(1, 0, 1, 6)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does assignment from a function', function() {
    var input = 'a = foo()';
    var expected = [{
      type: "statement",
      action: "SET `a` = RESULT OF SUBROUTINE foo()",
      loc: getLocation(1, 0, 1, 9)
    }];
    expect(parser(input)).toEqual(expected);
  });
});
