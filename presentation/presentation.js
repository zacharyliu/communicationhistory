$("body").addClass("presentation");

var buffer = 'Presentation mode activated.<br>Setup client displays and remotes:<br><br><br>Status display:<div id="clientStatus"></div>Remote:<div id="clientRemote"></div>Teleprompter:<div id="clientPrompter"></div>';
modal.clear();
modal.load(buffer);
modal.show();
$("#clientStatus, #clientRemote, #clientPrompter").css({width: "200px", height: "50px", "background-color": "red", margin: "10px", color: "white", padding: "4px"}).html("Waiting...");