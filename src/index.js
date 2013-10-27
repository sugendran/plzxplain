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

function drawBlock(steps, container) {
	var wrap = $('<div class="step block"></div>').appendTo(container);
	$('<a href="#" class="step begin">BEGIN</a>').appendTo(wrap);
	var block = $('<div class="step block"></div>').appendTo(wrap);
	displaySteps(steps, block);
	$('<a href="#" class="step end">END</a>').appendTo(wrap);
}

var drawFuncs = {
	subroutine: function(subroutine, targetElem) {
		$('<a href="#" class="step set"></a>').text(subroutine.action).appendTo(targetElem);
		drawBlock(subroutine.block, targetElem);
	},
	subroutinecall: function(subroutinecall, targetElem) {
		$('<a href="#" class="step call"></a>').text(subroutinecall.action).appendTo(targetElem);
	},
	statement: function(step, targetElem) {
		$('<a href="#" class="step set"></a>').text(step.action).appendTo(targetElem);
	},
	question: function(question, targetElem) {
		$('<a href="#" class="step question"></a>').text(question.action).appendTo(targetElem);
		drawBlock(question.yes, targetElem);

		if(question.no) {
			$('<a href="#" class="step question-else">ELSE</a>').appendTo(targetElem);
			drawBlock(question.no, targetElem);
		}
	},
	loop: function(loop, targetElem) {
		$('<a href="#" class="step question"></a>').text('LOOP').appendTo(targetElem);
		$('<a href="#" class="step question"></a>').text('IF ' + loop.test + ' THEN EXIT LOOP').appendTo(targetElem);

		drawBlock(loop.body, targetElem);
	}
};

function displaySteps(steps, targetElem) {
	for(var i=0,ii=steps.length; i<ii; i++) {
		var step = steps[i];
		if(step.constructor === Array) {
			displaySteps(step, targetElem);
		} else if(drawFuncs[step.type]) {
			drawFuncs[step.type](step, targetElem);
		} else {
			console.error("can't draw: ");
			console.error(step);
		}
	}
}

function onEditorUpdated() {
	if(codeMirrorObj) {
		var steps = parser(codeMirrorObj.getValue());
		if(steps.constructor === Error) {
			displayParseError(steps.message);
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
