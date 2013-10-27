var parser = require('../src/parser');
var getLocation = require('./helpers/parser-helpers').getLocation;

describe('questions: ', function() {
  it('does truthy tests', function() {
    var input = 'if(a) { a++; }';
    var expected = [{
      type: "question",
      action: "IF `a` IS TRUE",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 8, 1, 11)
      }],
      loc: getLocation(1, 0, 1, 14)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does truthy tests without blocks', function() {
    var input = 'if(a) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS TRUE",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 6, 1, 9)
      }],
      loc: getLocation(1, 0, 1, 10)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does not truthy tests', function() {
    var input = 'if(!a) { a++; }';
    var expected = [{
      type: "question",
      action: "IF `a` IS NOT TRUTHY",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 9, 1, 12)
      }],
      loc: getLocation(1, 0, 1, 15)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does == tests', function() {
    var input = 'if(a == b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS EQUAL TO `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 11, 1, 14)
      }],
      loc: getLocation(1, 0, 1, 15)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does === tests', function() {
    var input = 'if(a === b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS EXACTLY EQUAL TO `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 12, 1, 15)
      }],
      loc: getLocation(1, 0, 1, 16)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does >= tests', function() {
    var input = 'if(a >= b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS GREATER THAN OR EQUAL TO `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 11, 1, 14)
      }],
      loc: getLocation(1, 0, 1, 15)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does <= tests', function() {
    var input = 'if(a <= b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS LESS THAN OR EQUAL TO `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 11, 1, 14)
      }],
      loc: getLocation(1, 0, 1, 15)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does > tests', function() {
    var input = 'if(a > b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS GREATER THAN `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 10, 1, 13)
      }],
      loc: getLocation(1, 0, 1, 14)
    }];
    expect(parser(input)).toEqual(expected);
  });
  it('does < tests', function() {
    var input = 'if(a < b) a++;';
    var expected = [{
      type: "question",
      action: "IF `a` IS LESS THAN `b`",
      yes: [{
          type: "statement",
          action: "SET `a` = `a` + 1",
          loc: getLocation(1, 10, 1, 13)
      }],
      loc: getLocation(1, 0, 1, 14)
    }];
    expect(parser(input)).toEqual(expected);
  });
});
