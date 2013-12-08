/*globals console */
(function(plzxplain, esprima) {
	"use strict";
	// this parser will take the javascript AST from esprima
	// and then convert it into the info needed to draw a flowchart
	// right now it's assumed that a flow chart has the following elements
	// statement - rectangle (SET VARIABLE, DECLARE VARIABLE, DECLARE SUBROUTINE)
	// question - diamond (YES/NO)
	// subroutine - rectangle (DECLARE SUBROUTINE) and then show the block for it
	// subroutinecall - rectangle with an extra vertical line each side
	//
	// this may not properly reflect everything that can be done with javascript
	// but that's not the idea of this project - simple explainations are best
	//
	// We're going to use flowchart.js to render the flowchart
	// it requires that we create a list of symbols and then create
	// a set of flows that link the symbols together
	//
	// For this to work we need an array of flowcharts. The item at index zero
	// would be the main program and then every item after that would be a
	// subroutine.
	//
	/* example resulting object
	[{
		name: "Program",
		symbols: [{
			type: 'operation',
			id: 'op1',
			text: 'Declare variable `i`',
			loc: { ... }
		},{
			type: 'operation',
			id: 'op2',
			text: 'Set variable `i` to be 1',
			loc: { ... }
		}],
		sequences: [['op1', 'op2']]
	}]
	*/

	var parsedResult = [];
	var statementCounter = 1;
	var questionCounter = 1;
	var anonFuncCounter = 1;
	var nodeParsers = { };
	var binaryoperators = {
		"==": "IS EQUAL TO",
		"===": "IS EXACTLY EQUAL TO",
		"<": "IS LESS THAN",
		">": "IS GREATER THAN",
		"<=": "IS LESS THAN OR EQUAL TO",
		">=": "IS GREATER THAN OR EQUAL TO"
	};

	function makeSymbol(type, text, loc) {
		return {
			id: 'op' + (statementCounter++),
			type: type,
			text: text,
			loc: loc || null
		};
	}
	function makeOperation(text, loc) {
		return makeSymbol('operation', text, loc);
	}
	function makeSubroutine(text, loc) {
		return makeSymbol('subroutine', text, loc);
	}
	function makeCondition(text, loc){
		return makeSymbol('condition', text, loc);
	}
	function blankResult() {
		return {
			symbols: [],
			sequences: [],
			firstStep: null,
			lastStep: null,
			conditionStep: null
		};
	}
	function isStringOrNum(val) {
		var valtype = typeof(val);
		return (valtype === 'string' || valtype === 'number');
	}
	function parseNode(node, asCondition) {
		if(!nodeParsers[node.type]) {
			throw new Error("Parser not implemented for node type " + node.type);
		}
		return nodeParsers[node.type](node, asCondition);
	}
	function pushSequence(sequenceArr, currentStep, val) {
		if(!currentStep) {
			return;
		}
		if(currentStep.constructor === Array) {
			for(var i=0, ii=currentStep.length; i<ii; i++) {
				pushSequence(sequenceArr, currentStep[i], val);
			}
			return;
		}
		if(currentStep.type === 'condition') {
			if(currentStep.yes) {
				if(currentStep.no) {
					sequenceArr.push([currentStep.id + "(then)", val.id]);
					currentStep.then = true;
				} else {
					sequenceArr.push([currentStep.id + "(no)", val.id]);
					currentStep.no = true;
				}
			} else {
				sequenceArr.push([currentStep.id + "(yes)", val.id]);
				currentStep.yes = true;
			}
		} else {
			sequenceArr.push([currentStep.id, val.id]);
		}
	}
	function mergeResult(symbolsArr, sequenceArr, currentStep, val) {
		if(val.id) {
			symbolsArr.push(val);
			if(currentStep) {
				pushSequence(sequenceArr, currentStep, val);
			}
			currentStep = val;
		} else if(!val.symbols) {
			debugger;
		} else {
			// lots of steps and sequences
			for(var i=0, ii=val.symbols.length; i<ii; i++) {
				symbolsArr.push(val.symbols[i]);
			}
			if(currentStep) {
				pushSequence(sequenceArr, currentStep, val.firstStep);
			}
			for(var j=0, jj=val.sequences.length; j<jj; j++) {
				sequenceArr.push(val.sequences[j]);
			}
			currentStep = val.lastStep;
		}
		return currentStep;
	}
	function parseBlock(symbolsArr, sequenceArr, currentStep, block) {
		var i, ii, firstStep;
		firstStep = currentStep;
		for(i=0, ii=block.length; i<ii; i++) {
			var node = block[i];
			if(nodeParsers[node.type]) {
				var val = parseNode(node);
				if(isStringOrNum(val)) {
					val = makeOperation(val, node.loc);
				}
				currentStep = mergeResult(symbolsArr, sequenceArr, currentStep, val);
			} else {
				var step = makeOperation('Error parsing unknown node type - ' + node.type);
				symbolsArr.push(step);
				pushSequence(sequenceArr, currentStep, step);
				currentStep = step;
			}
			if(!firstStep) {
				firstStep = currentStep;
			}
		}
		return {
			symbols: symbolsArr,
			sequences: sequenceArr,
			firstStep: currentStep,
			lastStep: currentStep
		};
	}
	function parseTest(test) {
		var result = {
			symbols: [],
			sequences: [],
			firstStep: null,
			lastStep: null,
			conditionStep: null
		};
		var testVal = parseNode(test, true);
		if(isStringOrNum(testVal)) {
			var cond = makeCondition(testVal, test.loc);
			result.symbols.push(cond);
			result.lastStep = cond;
			result.firstStep = cond;
			result.conditionStep = cond;
		} else {
			result.lastStep = mergeResult(result.symbols, result.sequences, null, testVal);
			result.firstStep = result.symbols[0];
			result.conditionStep = result.lastStep;
		}
		return result;
	}
	function parseRoutine(name, body) {
		var program = { name: name, symbols: [], sequences: [] };
		parsedResult.push(program);
		var start = {
			type: 'start',
			id: 'start_' + name,
			text: 'Start ' + name
		};
		program.symbols.push(start);
		var currentStep = start;
		var result = parseBlock(program.symbols, program.sequences, currentStep, body);
		var end = {
			type: 'end',
			id: 'end_' + name,
			text: 'End ' + name
		};
		program.symbols.push(end);
		pushSequence(program.sequences, result.lastStep, end);
	}
	nodeParsers.Program = function(tree) {
		parseRoutine('Program', tree.body);
	};
	nodeParsers.Identifier = function(node) {
		return "`" + node.name + "`";
	};
	nodeParsers.Literal = function(node) {
		if(typeof node.value === 'boolean') {
			return node.value ? 'TRUE' : 'FALSE';
		} else if(isFinite(node.value)) {
			return parseFloat(node.value);
		}
		return "'" + node.value + "'";
	};
	nodeParsers.VariableDeclaration = function(node) {
		var symbols = [];
		var sequences = [];
		var currentStep;
		var firstStep;
		var dec = node.declarations;
		for(var i=0, ii=dec.length;i<ii;i++) {
			var d = dec[i];
			if(d.type === "VariableDeclarator") {
				var declareStep = makeOperation("DECLARE VARIABLE " + parseNode(d.id), d.id.loc);
				symbols.push(declareStep);
				if(currentStep) {
					sequences.push([currentStep.id, declareStep.id]);
				} else {
					firstStep = declareStep;
				}
				currentStep = declareStep;
				if(d.init) {
					var initVal = parseNode(d.init);
					var action = "SET " + parseNode(d.id) + " = ";
					if(isStringOrNum(initVal)) {
						action += initVal;
					} else {
						action += '(' + initVal.text + ')';
					}
					var initStep = makeOperation(action, node.loc);
					symbols.push(initStep);
					sequences.push([currentStep.id, initStep.id]);
					currentStep = initStep;
				}
			} else {
				console.error("Unknown variable declaration: " + JSON.stringify(node));
			}
		}
		return {
			symbols: symbols,
			sequences: sequences,
			firstStep: firstStep,
			lastStep: currentStep
		};
	};
	nodeParsers.ArrayExpression = function(node) {
		var result = 'ARRAY CONTAINING ';
		if(node.elements.length === 0) {
			result += 'NOTHING';
		} else {
			var items = [];
			for(var i=0, ii=node.elements.length; i<ii; i++) {
				var val = parseNode(node.elements[i]);
				items.push(val);
			}
			result += items.join(', ');
		}
		return result;
	};
	nodeParsers.FunctionDeclaration = function(node) {
		var subroutineName = parseNode(node.id);
		var action = "DECLARE SUBROUTINE " + subroutineName + " WITH " + node.params.length + " PARAMETERS";
		parseRoutine(subroutineName, node.body.body);
		return makeOperation(action, node.loc);
	};
	nodeParsers.FunctionExpression = function(node) {
		var subroutineName;
		if(node.id){
			subroutineName = parseNode(node.id);
		} else {
			subroutineName = 'AnonymousFunction' + (anonFuncCounter++);
		}
		var action = "DECLARE SUBROUTINE " + subroutineName + " WITH " + node.params.length + " PARAMETERS";
		parseRoutine(subroutineName, node.body.body);
		return makeOperation(action, node.loc);
	};
	nodeParsers.BlockStatement = function(node) {
		return parseBlock([], [], null, node.body);
	};
	nodeParsers.ExpressionStatement = function(node) {
		return parseNode(node.expression);
	};
	nodeParsers.DebuggerStatement = function(node) {
		return makeSubroutine("Pause code execution when debugging", node.loc);
	};
	nodeParsers.CallExpression = function(node) {
		var calleeVal = parseNode(node.callee);
		var action = "CALL SUBROUTINE ";
		if(isStringOrNum(calleeVal)) {
			action += calleeVal;
		} else {
			action += calleeVal.text;
		}
		var args = node['arguments'];
		if(args.length) {
			action += " WITH ";
			var argList = [];
			for(var i=0, ii=args.length; i<ii; i++) {
				var arg = args[i];
				argList.push(parseNode(arg));
			}
			action += argList.join(", ");
		}
		return makeSubroutine(action, node.loc);
	};
	nodeParsers.NewExpression = function(node) {
		var calleeVal = parseNode(node.callee);
		return makeSubroutine("NEW OBJECT OF TYPE " + calleeVal, node.loc);
	};
	nodeParsers.MemberExpression = function(node) {
		var left, right;
		var objVal = parseNode(node.object);
		if(isStringOrNum(objVal)){
			left = objVal;
		} else {
			left = '(' + objVal.text + ')';
		}
		right = parseNode(node.property);
		return left + '.' + right;
	}
	// a + b, a - b, a == b, a * b, a / b
	/*
	"==" | "!=" | "===" | "!=="
	         | "<" | "<=" | ">" | ">="
	         | "<<" | ">>" | ">>>"
	         | "+" | "-" | "*" | "/" | "%"
	         | "|" | "^" | "in"
	         | "instanceof" | ".."
	*/
	nodeParsers.BinaryExpression = function(node, asCondition) {
		var result = blankResult();
		var left, right, operator, symbol;
		function parseValue(n) {
			var returnable;
			var val = parseNode(n);
			if(isStringOrNum(val)) {
				returnable = parseNode(n);
			} else {
				result.lastStep = mergeResult(result.symbols, result.sequences, result.lastStep, val);
				if(n.type === 'UpdateExpression') {
					returnable = parseNode(n.argument);
					console.log(returnable);
				} else {
					debugger;
				}
			}
			return returnable;
		}
		// todo: need to parse out statements from left and right
		// then work out left and right values for the comparison
		left = parseValue(node.left);
		right = parseValue(node.right);
		result.firstStep = result.symbols[0];

		var operator = binaryoperators[node.operator] || node.operator;
		var action = left + " " + operator + " " + right;
		var symbol = asCondition ? makeCondition(action, node.loc) : makeOperation(action, node.loc);
		result.symbols.push(symbol);
		if(result.lastStep) {
			result.sequences.push([result.lastStep.id, symbol.id]);
		}
		result.lastStep = symbol;

		return result;
	};
	nodeParsers.UnaryExpression = function(node) {
		var test = parseNode(node.argument);
		if(node.prefix) {
			// if it's a math operator then do something different
			if(node.operator === '-' || node.operator === '+') {
				return '(' + node.operator + test + ')';
			}
		}
		var truthyness = node.operator === '!' ? 'IS NOT TRUTHY' : 'IS TRUTHY';
		return  test + " " + truthyness;
	};
	nodeParsers.AssignmentExpression = function(node) {
		var action;
		var left = parseNode(node.left);
		var right = parseNode(node.right);
		if(node.operator === '=') {
			action = "SET " + left + " = " + right;
		} else {
			var operator = node.operator.substr(0, node.operator.length - 1);
			action = "SET " + left + " = " + left + " " + operator + " " + right;
		}
		return makeOperation(action, node.loc);
	};
	nodeParsers.WhileStatement = function(node) {
		var result = parseTest(node.test);

		var firstTestStep = result.firstStep;
		var conditionStep = result.conditionStep;
		var testLen = result.symbols.length;

		var bodyVal = parseNode(node.body);
		var finalBodyStep = mergeResult(result.symbols, result.sequences, null, bodyVal);
		var firstBodyStep = result.symbols[testLen];
		result.sequences.push([finalBodyStep.id, firstTestStep.id]);
		result.sequences.push([conditionStep.id + '(yes)', firstBodyStep.id]);
		conditionStep.yes = true;
		result.lastStep = conditionStep;
		return result;
	};
	nodeParsers.ForStatement = function(node) {
		// init -> test -> update -> body -> test
		var result = parseNode(node.init);
		var test = parseTest(node.test);
		result.lastStep = mergeResult(result.symbols, result.sequences, result.lastStep, test);
		var bodyValue = parseNode(node.body);
		result.lastStep = mergeResult(result.symbols, result.sequences, result.lastStep, bodyValue);
		result.sequences.push([result.lastStep.id, test.lastStep.id]);
		result.lastStep = test.lastStep;
		return result;
	};
	nodeParsers.UpdateExpression = function(node) {
		var obj = parseNode(node.argument);
		var action = "SET " + obj + " = ";
		if(node.operator === "++") {
			action += obj +" + 1";
		}else if(node.operator === "--") {
			action += obj +" - 1";
		}
		return makeOperation(action, node.loc);
	};
	nodeParsers.IfStatement = function(node) {
		var result = parseTest(node.test);
		var len = result.symbols.length;
		var finalSteps = [result.conditionStep];
		// yes
		var yesVal = parseNode(node.consequent);
		finalSteps.push(mergeResult(result.symbols, result.sequences, null, yesVal));

		result.sequences.push([result.conditionStep.id + '(yes)', result.symbols[len].id]);
		result.conditionStep.yes = true;
		len = result.symbols.length;

		// no
		if(node.alternate) {
			var noVal = parseNode(node.alternate);
			finalSteps.push(mergeResult(result.symbols, result.sequences, null, noVal));
			result.sequences.push([result.conditionStep.id + '(no)', result.symbols[len].id]);
			result.conditionStep.no = true;
		}

		result.lastStep = finalSteps;

		return result;
	};
	nodeParsers.LogicalExpression = function(node) {
		return 'VALUE OF ' + parseNode(node.left) + ' ' + node.operator + ' ' + parseNode(node.right);
	};
	nodeParsers.ReturnStatement = function(node) {
		return 'RETURN ' + parseNode(node.argument);
	};

	// will return an error or an array of converted items
	function parse(str) {
		var obj;
		try {
			obj = esprima.parse(str, { loc: true });
		} catch(e) {
			return e;
		}

		try{
			parsedResult = [];
			parseNode(obj);
			return parsedResult;
		} catch(e) {
			debugger;
			return e;
		}
	}

	plzxplain.parse = parse;
	plzxplain.parse.getParsers = function() { return nodeParsers; };

})(this.plzxplain, this.esprima);