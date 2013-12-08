(function(plzxplain, $, CodeMirror, flowchart) {
	var codeMirrorObj = null;
	var headerHeight = $("#header").height();
	var footerHeight = $("#footer").height();
	var flowchartOpts = {
    'line-width': 3,
    'line-length': 26,
    'text-margin': 10,
    'font-size': 14,
    'font-color': '#000',
    'line-color': '#333',
    'element-color': '#333',
    'fill': '#FFF',
    'yes-text': 'yes',
    'no-text': 'no',
    'arrow-end': 'block'
  }

	function onResize() {
		var h = $(window).height() - (headerHeight + footerHeight);
		$("#content").height(h);
		$("#code-box .CodeMirror-scroll").height(h);
		// $("#flowchart-container").height(h);
		if(codeMirrorObj) {
			setTimeout(function(){
				codeMirrorObj.refresh();
			}, 0);
		}
	}
	onResize();

	function displayParseError(msg) {
		console.error(msg);
		$("#flowchart-container").html(msg);
	}

	var routineCount = 0;
	function displayRoutine(routine, flowchartContainer) {
		var lines = [];
		for(var i=0, ii=routine.symbols.length; i<ii; i++) {
			var symbol = routine.symbols[i];
			lines.push(symbol.id + '=>' + symbol.type + ': ' + symbol.text);
		}
		for(var j=0, jj=routine.sequences.length; j<jj; j++) {
			var sequence = routine.sequences[j];
			lines.push(sequence.join('->'));
		}
		var divID = 'routine_' + (routineCount++);
		$('<div id="' + divID + '"></div>').appendTo(flowchartContainer);
		flowchart.parse(lines.join('\n')).drawSVG(divID, flowchartOpts);
	}

	function onEditorUpdated() {
		if(codeMirrorObj) {
			var program = plzxplain.parse(codeMirrorObj.getValue());

			if(program instanceof Error) {
				displayParseError(program.message);
			} else {
				var flowchart = $("#flowchart-container").empty();
				for(var i=0, ii=program.length; i<ii; i++) {
					displayRoutine(program[i], flowchart);
				}
			}
		}
	}
	codeMirrorObj = CodeMirror.fromTextArea(document.getElementById("code"), {autofocus: true});
	codeMirrorObj.on('update', onEditorUpdated);

	// on ready we can go binding things
	$(function(){
		headerHeight = $("#header").height();
		footerHeight = $("#footer").height();
		$(window).resize(onResize).resize();
	});

})(this.plzxplain, this.$, this.CodeMirror, this.flowchart);