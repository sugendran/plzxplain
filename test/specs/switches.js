describe('switch statements', function() {
  it('does a simple switch', function() {
    var input = "switch(a) { case 1: foo(); break; }";
    var expected = [{
      "name": "Program",
      "symbols": [start_Program, {
        "id": "op1",
        "type": "condition",
        "text": "`a` EQUALS 1",
        "yes": true,
        no: true,
        "loc": getLocation(1, 17, 1, 18)
      }, {
        id: "op2",
        type: "subroutine",
        text: "CALL SUBROUTINE `foo`",
        loc: getLocation(1, 20, 1, 25)
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