var $ = require("jquery-browserify");
var CodeMirror = require("./codemirror/codemirror.js");
require("./codemirror/javascript.js")(CodeMirror);
var parser = require("./parser.js");

var codeMirrorObj = null;
var headerHeight = $("#header").height();
var footerHeight = $("#footer").height();

function onResize() {
	var h = $(window).height() - (headerHeight + footerHeight);
	$("#content").height(h);
	$("#code-box .CodeMirror-scroll").height(h);
	$("#flowchart").height(h);
	if(codeMirrorObj) {
		setTimeout(function(){
			codeMirrorObj.refresh();
		}, 0);
	}
}
onResize();

function displayParseError(msg) {
	$("#flowchart").html(msg);
}

var drawFuncs = {
	"subroutine": function(subroutine, targetElem) {
		$('<a href="#" class="step set"></a>').text(subroutine.action).appendTo(targetElem);
		var container = $('<div class="step subroutine"></div>');
		$('<a href="#" class="step subroutine-begin"></a>')
			.text("BEGIN SUBROUTINE `" + subroutine.name + "`")
			.appendTo(container);
		displaySteps(subroutine.actions, container);
		$('<a href="#" class="step subroutine-end"></a>')
			.text("END SUBROUTINE `" + subroutine.name + "`")
			.appendTo(container);
		container.appendTo(targetElem);
	},
	"statement": function(step, targetElem) {
		$('<a href="#" class="step set"></a>').text(step.action).appendTo(targetElem);
	}
}

function displaySteps(steps, targetElem) {
	for(var i=0,ii=steps.length; i<ii; i++) {
		var step = steps[i];
		if(drawFuncs[step.type]) {
			drawFuncs[step.type](step, targetElem);
		} else {
			debugger;
			console.error(step);
		}
	}
}

function onEditorUpdated() {
	if(codeMirrorObj) {
		var steps = parser(codeMirrorObj.getValue());
		if(steps.constructor === Error) {
			displayParseError(e.message);
		} else {
			console.log(steps);
			var flowchart = $("#flowchart").empty();
			displaySteps(steps, flowchart);
		}
	}
}
codeMirrorObj = CodeMirror.fromTextArea(document.getElementById("code"), {autofocus: true, onUpdate: onEditorUpdated});

// on ready we can go binding things
$(function(){
	headerHeight = $("#header").height();
	footerHeight = $("#footer").height();
	$(window).resize(onResize).resize();
});
