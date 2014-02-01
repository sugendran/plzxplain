describe('function things: ', function() {
  it('can call a function', function() {
    var input = 'alert("hi")';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "subroutine",
        "text": "CALL SUBROUTINE `alert` WITH 'hi'",
        "loc": getLocation(1, 0, 1, 11)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
  it('can call a function on an object', function() {
    var input = 'console.log("hi")';
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "subroutine",
        "text": "CALL SUBROUTINE `console`.`log` WITH 'hi'",
        "loc": getLocation(1, 0, 1, 17)
      },end_Program],
      "sequences": [
        ["start_Program", "op1"],
        ["op1", "end_Program"]
      ]
    }];
    expect(plzxplain.parse(input)).toEqual(expected);
  });
});