(function(plzxplain, $, CodeMirror, flowchart) {
  "use strict";
  var codeMirrorObj = null;
  var codeTextArea = document.getElementById('code');
  var headerHeight = $("#header").outerHeight();
  var footerHeight = $("#footer").outerHeight();
  var flowchartOpts = {
    'maxWidth': 240,
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
    'arrow-end': 'block',
    'symbols': {
      'condition': {
        'text-margin': 0,
        'maxWidth': 180
      }
    }
  };
  var codeMirrorOpts = {
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true
  };

  function scaleContentBox() {
    var w = 0;
    $(".content-item").each(function(){
      w += $(this).outerWidth() + 26;
    });
    w = Math.max(w, $(window).width());
    $("#content, #header, #footer").width(w);
  }

  function getHeight() {
    return $(window).height() - (headerHeight + footerHeight) - 64;
  }

  function onResize() {
    var h = getHeight();
    var w = $(window).width();

    $(".content-item").css("min-height", h + 'px');
    $("#code-box .CodeMirror").height(h);

    $(".error").css("left", (w/2 - 200) + "px");
    if(codeMirrorObj) {
      setTimeout(function(){
        codeMirrorObj.refresh();
      }, 0);
    }
    scaleContentBox();
  }
  onResize();

  function displayParseError(msg) {
    console.error(msg);
    $(".error").html(msg).show();
  }

  var routineCount = 0;
  function displayRoutine(routine, flowchartContainer, tabsContainer) {
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
    $('<div id="' + divID + '" class="content-item routine"></div>').appendTo(flowchartContainer);
    console.log(lines.join('\n'));
    flowchart.parse(lines.join('\n')).drawSVG(divID, flowchartOpts);
    $('<a href="#' + divID + '">' + routine.name + '</a>').appendTo(tabsContainer);
  }

  var debounceTimer = null;
  function onEditorUpdated() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(_onEditorUpdated, 100);
  }

  function _onEditorUpdated() {
    if(codeMirrorObj) {
      plzxplain.parse.resetCounters();
      var program = plzxplain.parse(codeMirrorObj.getValue());

      if(program instanceof Error) {
        displayParseError(program.message);
      } else {
        $(".error").hide();
        var content = $("#content");
        content.children(".routine").remove();
        var tabs = $('.tabs');
        tabs.children().not(":first").remove();
        for(var i=0, ii=program.length; i<ii; i++) {
          displayRoutine(program[i], content, tabs);
        }
        var h = getHeight();
        $(".content-item").css("min-height", h + 'px');
        scaleContentBox();
      }
    }
  }

  var matches = new RegExp("gist=([0-9a-z]+)", "i").exec(window.location.href);
  if(matches && matches.length === 2) {
    codeTextArea.innerText = '// Loading gist . . . ';
    var gistId = matches[1];
    $.ajax({
      url: 'https://api.github.com/gists/' + gistId,
      type: 'GET',
      dataType: 'jsonp'
    }).error(function() {
      codeMirrorObj.setValue('// Failed to load gist');
    }).success(function(gistData) {
      var newContent = "// Gist didn't contain any JavaScript";
      var files = gistData.data.files;
      for(var filename in files) {
        if(files[filename].type === "application/javascript") {
          newContent = files[filename].content;
          break;
        }
      }
      codeMirrorObj.setValue(newContent);
    });
  }

  codeMirrorObj = CodeMirror.fromTextArea(codeTextArea, codeMirrorOpts);
  codeMirrorObj.on('update', onEditorUpdated);

  // on ready we can go binding things
  $(function(){
    headerHeight = $("#header").height();
    footerHeight = $("#footer").height();
    $(window).resize(onResize).resize();
  });

})(this.plzxplain, this.$, this.CodeMirror, this.flowchart);