describe('questions: ', function() {
  it('does truthy tests', function() {
    var input = 'if(a) { a++; }';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 4)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 8, 1, 11)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does truthy tests without blocks', function() {
    var input = 'if(a) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 4)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 6, 1, 9)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does not truthy tests', function() {
    var input = 'if(!a) { a++; }';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS NOT TRUTHY",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 5)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 9, 1, 12)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does == tests', function() {
    var input = 'if(a == b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS EQUAL TO `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 9)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 11, 1, 14)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does === tests', function() {
    var input = 'if(a === b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS EXACTLY EQUAL TO `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 10)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 12, 1, 15)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does >= tests', function() {
    var input = 'if(a >= b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS GREATER THAN OR EQUAL TO `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 9)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 11, 1, 14)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does <= tests', function() {
    var input = 'if(a <= b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS LESS THAN OR EQUAL TO `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 9)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 11, 1, 14)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does > tests', function() {
    var input = 'if(a > b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS GREATER THAN `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 8)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 10, 1, 13)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('does < tests', function() {
    var input = 'if(a < b) a++;';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` IS LESS THAN `b`",
        "yes": true,
        no: true,
        "loc": getLocation(1, 3, 1, 8)
      }, {
        id: "op2",
        type: "operation",
        text: "SET `a` = `a` + 1",
        loc: getLocation(1, 10, 1, 13)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1(yes)", "op2"],
        ["op1(no)", "end_Program"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
});
