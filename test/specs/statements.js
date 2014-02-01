describe('statements', function() {

  it('does simple variable declaration', function() {
    var input = 'count=0';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `count` = 0",
        "loc": getLocation(1, 0, 1, 7)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('does variable incrementation', function() {
    var input = 'a++';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `a` = `a` + 1",
        "loc": getLocation(1, 0, 1, 3)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('does variable incrementation the other way', function() {
    var input = '++a';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `a` = `a` + 1",
        "loc": getLocation(1, 0, 1, 3)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('variable equals another variable', function() {
    var input = 'a=b';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `a` = `b`",
        "loc": getLocation(1, 0, 1, 3)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('does variable incrementation by n', function() {
    var input = 'a += 2';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `a` = `a` + 2",
        "loc": getLocation(1, 0, 1, 6)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('does variable decrement by n', function() {
    var input = 'a -= 2';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "operation",
        "text": "SET `a` = `a` - 2",
        "loc": getLocation(1, 0, 1, 6)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });

  it('does assignment from a function', function() {
    var input = 'a = foo()';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op2",
        "type": "operation",
        "text": "SET `a` = (CALL SUBROUTINE `foo`)",
        "loc": getLocation(1, 0, 1, 9)
      },end_Program],
      "sequences": [
        ["start_Program", "op2"],
        ["op2", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
});