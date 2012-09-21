// define variables
var playing = false; // is scrolling
var counting = false; // clock is counting down
var countingRef = null; // clock's setInterval global reference
function readClock() {
    time = $("#clock").attr("value");
    time = time.split(':');
    if (!time[1]) {
        time[1] = 0;
    }
    time = ((time[0] * 60) + (time[1] * 1));
    // outputs time in seconds
    return time;
}
function play() {
    if (playing) { return false; }
    time = readClock() * 1000;
    $("body").scrollTo("max", time, {easing: "linear"});
    playing = true;
    $("#infocontainer").hide();
    if (!counting) {
        runClock();
    }
}
function pause() {
    $("body").stop();
    playing = false;
    $("#state").html("paused");
    $("#infobody").css({"border-left-color": "yellow", "border-right-color": "yellow", "border-bottom-color": "yellow"});
    $("#infocontainer").show();
}
function stop(quiet) {
    $("body").stop();
    playing = false;
    stopClock();
    if (!quiet) {
        $("#state").html("stopped");
        $("#infobody").css({"border-left-color": "red", "border-right-color": "red", "border-bottom-color": "red"});
        $("#infocontainer").show();
    }
}
function runClock() {
    countingRef = setInterval("updateClock()", 1000);
    counting = true;
}
function stopClock() {
    clearInterval(countingRef);
    counting = false;
}
function writeClock(time) {
    // input: time in seconds
    min = Math.floor(time/60);
    sec = time % 60;
    if (sec <= 9) {
        secPrefix = "0";
    }
    else {
        secPrefix = "";
    }
    if (min <= 9) {
        minPrefix = "0";
    }
    else {
        minPrefix = "";
    }
    timePrint = minPrefix + min + ":" + secPrefix + sec;
    $("#clock").attr("value", timePrint);
}
function updateClock() {
    time = (readClock() * 1) - 1;
    if (time < 0) {
        stop();
        return false;
    }
    writeClock(time);
    if (time == 0) {
        stop();
        return false;
    }
}
function adjustSize(px) {
$("#text, #text *").each(function() {
    size = $(this).css("font-size");
    size = size.split("px")[0];
    size = (size * 1) + (px * 1);
    $(this).css("font-size", size + "px");
});
}
function smaller() {
    adjustSize(-5);
}
function larger() {
    adjustSize(5);
}
function adjustSpeed(factor) {
    // input should be as such:
    // 0.95 for 5% decrease
    // 1.05 for 5% increase
    // and so forth
    time = readClock();
    newtime = Math.floor(factor * time);
    if (newtime == time) {
        newtime++;
    }
    if (playing) {
        stop(true);
        writeClock(newtime);
        play();
    }
    else {
        writeClock(newtime);
    }
}
function slower() {
    adjustSpeed(1.05);
}
function faster() {
    adjustSpeed(0.95);
}
function helpbutton() {
    $("#help").toggle(500);
}
// more initalizing stuff done when the DOM is ready
$(function() {
    // define hotkeys
    $(document).bind('keydown', 'h', function() {
        helpbutton();
    }).bind('keydown', 'p', function() {
        if (playing) {
            pause();
        } else {
            play();
        }
    }).bind('keydown', 'o', function() {
        if (playing || $("#state").html() == "paused") {
            stop();
        } else {
            play();
        }
    }).bind('keydown', '-', function() {
        smaller();
    }).bind('keydown', '+', function() {
        larger();
    }).bind('keydown', 'j', function() {
        slower();
    }).bind('keydown', 'k', function() {
        faster();
    });
    // define click events
    $(".button").click(function() {
        func = $(this).attr("id") + "()";
        eval(func);
    });
    /*$("body").scroll(function() {
        if (playing) {
            pause();
            //play();
        }
    });*/
});

// grab the content
$(function() {
    $.get("content.html", function(data) {
        $("#text").html(data);
    });
});