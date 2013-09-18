var esprima = require("esprima")

// this parser will take the javascript AST from esprima
// and then convert it into the info needed to draw a flowchart
// right now it's assumed that a flow chart has the following elements
// statement - rectangle (SET VARIABLE, DECLARE VARIABLE, DECLARE SUBROUTINE)
// question - diamond (YES/NO)
// subroutine - rectangle (DECLARE SUBROUTINE) and then show the block for it
// subroutinecall - rectangle with an extra vertical line each side
// loop - question followed by block
//
// this may not properly reflect everything that can be done with javascript
// but that's not the idea of this project - simple explainations are best

var nodeParsers = { };
nodeParsers["Program"] = function(tree) {
	var steps = [];
	var body = tree.body;
	for(var i=0, ii=body.length; i<ii; i++) {
		var node = body[i];
		if(nodeParsers[node.type]) {
			var val = nodeParsers[node.type](node);
			if(val.constructor === Array) {
				steps = steps.concat(val);
			} else {
				steps.push(val);
			}
		} else {
			steps.push({
				action: "undefined",
				text: node.type
			});
		}
	}
	return steps;
};
nodeParsers["Identifier"] = function(node) {
	return "`" + node.name + "`";
};
nodeParsers["Literal"] = function(node) {
	if(isFinite(node.value)) {
		return parseFloat(node.value);
	}
	return "'" + node.value + "'";
};
nodeParsers["VariableDeclaration"] = function(node) {
	var result = [];
	var dec = node.declarations;
	for(var i=0, ii=dec.length;i<ii;i++) {
		var d = dec[i];
		if(d.type == "VariableDeclarator") {
			var action = "SET " + nodeParsers[d.id.type](d.id) + " = " + nodeParsers[d.init.type](d.init);
			result.push({
				type: "statement",
				action: action,
				loc: node.loc
			});
		} else {
			console.error("Unknown variable declaration: " + JSON.stringify(node));
		}
	}
	return result;
};
nodeParsers["FunctionDeclaration"] = function(node) {
	var action = "DECLARE SUBROUTINE " + nodeParsers[node.id.type](node.id) + " WITH " + node.params.length + " PARAMETERS";
	var block = nodeParsers[node.body.type](node.body);
	return {
		type: "subroutine",
		action: action,
		block: block,
		loc: node.loc
	};
};
nodeParsers["BlockStatement"] = function(node) {
	var result = [];
	for(var i=0, ii=node.body.length; i<ii; i++) {
		var n = node.body[i];
		result.push(nodeParsers[n.type](n));
	}
	return result;
};
nodeParsers["ExpressionStatement"] = function(node) {
	return nodeParsers[node.expression.type](node.expression);
};
nodeParsers["CallExpression"] = function(node) {
	var action = "CALL SUBROUTINE " + nodeParsers[node.callee.type](node.callee);
	var args = node.arguments;
	if(args.length) {
		action += " WITH ARGUMENTS ";
		var argList = [];
		for(var i=0, ii=args.length; i<ii; i++) {
			var arg = args[i];
			argList.push(nodeParsers[arg.type](arg));
		}
		action += argList.join(", ");
	}
	return {
		type: "subroutinecall",
		action: action,
		loc: node.loc
	};
};
nodeParsers["MemberExpression"] = function(node) {
	return nodeParsers[node.object.type](node.object) + "." + nodeParsers[node.property.type](node.property);
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
nodeParsers["BinaryExpression"] = function(node) {
	var left = nodeParsers[node.left.type](node.left);
	var right = nodeParsers[node.right.type](node.right);
	if(left.constructor !== String)
	{
		console.log(JSON.stringify(node));
		console.log(JSON.stringify(left));
	}
	return "(" + left + " " + node.operator + " " + right + ")";
};
nodeParsers["AssignmentExpression"] = function(node) {
	var action = "SET " + nodeParsers[node.left.type](node.left) + " " + node.operator + " " + nodeParsers[node.right.type](node.right);
	return {
		type: "statement",
		action: action,
		loc: node.loc
	};
}
nodeParsers["WhileStatement"] = function(node) {
	var test = nodeParsers[node.test.type](node.test);
	var body = nodeParsers[node.body.type](node.body);
	return {
		type: "loop",
		test: test,
		body: body,
		loc: node.loc
	}
}
nodeParsers["UpdateExpression"] = function(node) {
	var obj = nodeParsers[node.argument.type](node.argument);
	var action = "SET " + obj + " = ";
	if(node.operator === "++") {
		action += obj +" + 1";
	}else if(node.operator === "--") {
		action += obj +" - 1";
	}
	return {
		type: "statement",
		action: action,
		loc: node.loc
	};
}
nodeParsers["IfStatement"] = function(node) {
	// need to check the contents of the if statement to see
	// if anything needs to be evaluated prior to the test
	var result = [];
	var yes, no;
	yes = nodeParsers[node.consequent.type](node.consequent);
	if(node.consequent.type !== "BlockStatement") {
		yes = [yes];
	}

	if(node.alternate) {
		no = nodeParsers[node.alternate.type](node.alternate);
	}
	if(node.test.type === "Identifier") {
		var val = {
			type: "question",
			action: "IF " + nodeParsers[node.test.type](node.test) + " IS TRUE",
			yes: yes,
			loc: node.loc
		};
		if(no) {
			val.no = no;
		}
		result.push(val);
	}
	return result;
}
// will return an error or an array of converted items
function parse(str) {
	try{
		var obj = esprima.parse(str, { loc: true });
		console.log("%j", obj);
		return nodeParsers[obj.type](obj);
	} catch(e) {
		return e;
	}
}

module.exports = parse;