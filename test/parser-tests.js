// parser-tests.js
var parser = require("../src/parser");
var fs = require("fs");
var assert = require("assert");

function parserTest(input, output) {
    var obj = parser(input);
    try {
        assert.deepEqual(obj, output);
    } catch (e) {
        console.error("%j\ndoes not match\n%j", obj, output);
        return false;
    }
    return true;
}

function getLocation(startLine, startCol, endLine, endCol) {
    return {
        start: {
            line: startLine,
            column: startCol
        },
        end: {
            line: endLine,
            column: endCol
        }
    };
}

var tests = [];

function addTests(input, output) {
    tests.push([input, output]);
}

function runTests() {
    if (!tests.length) return;
    var test = tests.shift();
    if (parserTest(test[0], test[1])) {
        console.log("--- success ----");
        setTimeout(runTests, 0);
    }
}
process.nextTick(runTests);

addTests("a=2", [{
    type: "statement",
    action: "SET `a` = 2",
    loc: getLocation(1, 0, 1, 3)
}]);
addTests("a++", [{
    type: "statement",
    action: "SET `a` = `a` + 1",
    loc: getLocation(1, 0, 1, 3)
}]);
addTests("if(a) { a++; }", [{
    type: "question",
    action: "IF `a` IS TRUE",
    yes: [{
        type: "statement",
        action: "SET `a` = `a` + 1",
        loc: getLocation(1, 8, 1, 11)
    }],
    loc: getLocation(1, 0, 1, 14)
}]);
addTests("if(a) a++;", [{
    type: "question",
    action: "IF `a` IS TRUE",
    yes: [{
        type: "statement",
        action: "SET `a` = `a` + 1",
        loc: getLocation(1, 6, 1, 9)
    }],
    loc: getLocation(1, 0, 1, 10)
}]);
addTests("if(a == b) a++;", [{
    type: "question",
    action: "IF `a` IS EQUAL TO `b`",
    yes: [{
        type: "statement",
        action: "SET `a` = `a` + 1",
        loc: getLocation(1, 6, 1, 9)
    }],
    loc: getLocation(1, 0, 1, 10)
}]);


// console.log("testing fib func");
// var fibprog = fs.readFileSync(__dirname + "/test-programs/fib.js");
// var out = parser(fibprog);
// if(out.message) {
// 	console.error(out);
// } else {
// 	console.log(JSON.stringify(out, null, "  "));
// }