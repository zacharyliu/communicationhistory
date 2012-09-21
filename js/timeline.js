var isDragging;

var BCDates = new Array;
var minDate = 1800;
var maxDate = 2011;
var timelineDateIncrement = 2;

var eventData = new Array;

var backgroundImages = new Array;

function addEvent(data) {
    // "data" should be an object containing the following elements:
    // title - title of event
    // description - brief info
    // date - date of event
    // links - array of external links to more information
    // video - URL of video to embed
    // sources - array of sources used
    
    if (data.title == undefined || data.date == undefined) {
        return;
    }
    
    var date = data.date;
    if (date < 0) {
        date = (-1) * date;
        date = date + " BC";
    }
    
    var html = '<div class="timelineEvent"><div class="timelineEventMarker"></div><div class="timelineEventDate">' + date + '</div><div class="timelineEventInfoWrapper"><div class="timelineEventInfo">'
    
    if (isValid(data.video)) {
        html = html + '<div class="videoIcon"></div>';
    }
    
    html = html + '<div class="timelineEventTitle">' + data.title + '</div></div></div></div>';
    
    /*Date.parse(data.date)
    Date.parse(minDate)
    Date.parse(maxDate)*/
    
    $("#timelineRight").append(html);
    
    // calculate position
    var position;
    // see if the date is below the minDate
    // if it is negative, it is BC, iterate through the BCDates array and see if the date matches any of them
    // if not, add an offset for the BC dates on the scale and then calculate the position
    if (data.date < minDate) {
        for (var i=0; i<BCDates.length; i++) {
            if (BCDates[i] ==  data.date) {
                position = (2 * i) * (100 / $(".timelineDate").length);
            }
        }
    } else {
        // offset past the BC dates
        position = (2 * BCDates.length) * (100 / $(".timelineDate").length);
        // find percentage offset within the AD dates, then multiply that by the ratio between the AD section and the whole thing
        position = position + (((data.date - minDate) / (maxDate - minDate)) * 100 * ((maxDate - minDate) / timelineDateIncrement) / $(".timelineDate").length);
    }
    
    position = position + "%";
    
    $(".timelineEvent").last().css({top: position}).click(function() {
        displayEvent(data);
    });
}

function isValid(string) {
    if (string != "" && string != undefined && string != null) {
        return true;
    } else {
        return false;
    }
}

function displayEvent(data) {
    // data object is same as addEvent
    
    var date = data.date;
    if (date < 0) {
        date = (-1) * date;
        date = date + " BC";
    }
    var content = '<div id="modalDialogHeader"><div id="modalDialogTitle">' + data.title + '</div><div id="modalDialogDate">' + date + '</div></div>';
    
    if (isValid(data.video)) {
        var videoIDRegex = /(?:\?|&)v=([0-9a-zA-Z_-]*)(?:&|$)/;
        var videoID = videoIDRegex.exec(data.video);
        //var videoEmbed = '<iframe title="YouTube video player" width="640" height="390" src="http://www.youtube.com/embed/' + videoID[1] + '" frameborder="0" allowfullscreen></iframe>';
        var videoEmbed = '<object width="640" height="390"><param name="movie" value="http://www.youtube.com/v/' + videoID[1] + '?fs=1&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/' + videoID[1] + '?fs=1&amp;hl=en_US" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="640" height="390"></embed></object>';
        content = content + '<div id="modalDialogVideo">' + videoEmbed + '</div>';
    }
    
    if (isValid(data.description)) {
        content = content + '<div id="modalDialogDescription">' + data.description + '</div>';
    } else {
        content = content + '<div id="modalDialogDescriptionBlank">' + data.description + '</div>';
    }
    
    if (isValid(data.links) || isValid(data.sources)) {
        content = content + '<div id="modalDialogTabsContainer"><div id="modalDialogTabs">';
        if (isValid(data.sources)) {
            content = content + '<div id="modalDialogTabSources">Sources</div>';
        }
        if (isValid(data.links)) {
            content = content + '<div id="modalDialogTabLinks">Links</div>';
        }
        content = content + '</div>';
    }
    

    if (isValid(data.sources)) {
        content = content + '<div id="modalDialogSources"><ul>';
        for (var i=0; i<data.sources.length; i++) {
            content = content + '<li><a target="_blank" href="' + data.sources[i] + '">' + data.sources[i] + '</a></li>';
        }
        content = content + '</ul></div>';
    }
    
    if (isValid(data.links)) {
        content = content + '<div id="modalDialogLinks"><ul>';
        for (var i=0; i<data.links.length; i++) {
            content = content + '<li><a target="_blank" href="' + data.links[i] + '">' + data.links[i] + '</a></li>';
        }
        content = content + '</ul></div>';
    }
    
    
    if (isValid(data.links) || isValid(data.sources)) {
        content = content + '</div>';
    }
    
    modal.clear();
    modal.load(content);
    modal.show();
    
    $("#modalDialogTabs *").first().addClass("active");
    $("#modalDialogTabLinks").click(function() {
        activateTab("links");
    });
    $("#modalDialogTabSources").click(function() {
        activateTab("sources");
    });
    if (isValid(data.sources) && isValid(data.links)) {
        $("#modalDialogLinks").hide();
    }
}

function activateTab(tab) {
    // "tab" is either "links" or "sources"
    if (tab == "links") {
        $("#modalDialogTabLinks").addClass("active");
        $("#modalDialogTabs > *").not("#modalDialogTabLinks").removeClass("active");
        $("#modalDialogTabsContainer > *").not("#modalDialogTabs").not("#modalDialogLinks").hide();
        $("#modalDialogLinks").show();
    }
    if (tab == "sources") {
        $("#modalDialogTabSources").addClass("active");
        $("#modalDialogTabs > *").not("#modalDialogTabSources").removeClass("active");
        $("#modalDialogTabsContainer > *").not("#modalDialogTabs").not("#modalDialogSources").hide();
        $("#modalDialogSources").show();
    }
}

var modal = new function() {
    this.load = function(html) {
        $("#modalDialog").html(html);
    }
    this.clear = function() {
        $("#modalDialog").html("");
    }
    this.show = function() {
        $("#modal").fadeIn(500);
        $("#modalDialog").show("drop", {direction: "up"}, 500);
    }
    this.hide = function() {
        $("#modal").fadeOut(500);
        $("#modalDialog").hide("drop", {direction: "up"}, 500);
    }
    this.resize = function(params) {
        $("#modalDialog").css({width: params.width, height: params.height})
    }
}

function loadEvents() {
    
    if (window.location.hash == "#robotics") {
        var dataURL = 'robotics.csv';
    } else {
        var dataURL = 'data.csv';
    }
    
    $.get(dataURL, function(data) {
        data = CSVToArray(data);
        
        // make array of arrays into a more useful array of objects
        for (var i=2; i<data.length; i++) {
            var b = i-2;
            eventData[b] = new Object;
            for (var a=0; a<data[i].length; a++) {
                eventData[b][data[0][a]] = data[i][a];
            }
        }
        
        // create "links", "sources", and "images" arrays
        // extract images from "images" and add to backgroundImages array
        // extract any "BC" dates, extract dates before 1400, make into integers
        for (var i=0; i<eventData.length; i++) {
            if (isValid(eventData[i].links)) {
                eventData[i].links = eventData[i].links.split(',');
            }
            if (isValid(eventData[i].sources)) {
                eventData[i].sources = eventData[i].sources.split(',');
            }
            if (isValid(eventData[i].images)) {
                eventData[i].images = eventData[i].images.split(',');
                for (var a=0; a<eventData[i].images.length; a++) {
                    backgroundImages.push(eventData[i].images[a]);
                }
            }
            
            if (isValid(eventData[i].date)) {
                eventData[i].date = eventData[i].date.replace(",", "")
                if (eventData[i].date.indexOf("BC") != -1) {
                    eventData[i].date = eventData[i].date.replace(" BC", "");
                    BCDates.push((-1) * eventData[i].date);
                    eventData[i].date = "-" + eventData[i].date;
                }
                eventData[i].date = parseInt(eventData[i].date);
                if (eventData[i].date < 1400 && eventData[i].date > 0) {
                    BCDates.push(eventData[i].date);
                }
            }
        }
        
        
        // add the images to the background, then animate it if user is not on an iPad
        populateBackground("#background");
        $("body").addClass("backgroundActivated");
        if (navigator.platform.indexOf("iPad") == -1) {
            //setTimeout(animateBackground, 3000);
        } 
        
        $("#background").click(function() {
                populateBackground("#background");
        });
        
        // add dates
        populateDates();
        
        // add events to timeline
        for (var i=0; i<eventData.length; i++) {
            addEvent(eventData[i]);
        }
        
        /*
        // adds mouseover effect
        $(".timelineEventInfo").mouseover(function() {
            $(this).stop().animate({height: "50px"}, 200);
        });
        $(".timelineEventInfo").mouseout(function() {
            $(this).stop().animate({height: "24px"}, 200);
        });
        */
        
        // detect iPad users and add/fix features
        if (navigator.platform.indexOf("iPad") != -1) {
           // $("#timeline").touchScroll();
           myScroll = new iScroll('timelineWrapper');
           $("#modal").click(function() {
                modal.clear();
                modal.hide();
            })
        }
    });
}

function populateDates() {
    
    // initialize the dates on the timeline
    
    // converts the BCDates array into integers
    for (var i=0; i<BCDates.length; i++) {
        BCDates[i] = parseInt(BCDates[i]);
    }
    // sorts in ascending order
    BCDates.sort(function(a,b){return a - b});
    
    // adds BC dates
    for (var i=0; i<BCDates.length; i++) {
        var dateString = BCDates[i];
        if (dateString < 0) {
            dateString = (-1) * dateString;
            dateString = dateString + " BC";
        }
        $("#timelineLeft").append('<div class="timelineDate">' + dateString + '</div><div class="timelineDate timelineDateBreak">&nbsp;</div>');
    }
    
    for (year=minDate; year<=maxDate; year=year+timelineDateIncrement) {
        $("#timelineLeft").append('<div class="timelineDate">' + year + '</div>');
    }
    
    // calculate sizes for timeline scale
    var timelineDateHeight = 100 / $(".timelineDate").length;
    var timelineDateTop = 0;
    for (var i=0; i<$(".timelineDate").length; i++) {
        $(".timelineDate").eq(i).css({top: timelineDateTop + "%"});
        timelineDateTop = timelineDateHeight + timelineDateTop; 
    }
    
    // set heights accordingly
    $("#timeline").height($(".timelineDate").length * 30);
    var panelDateHeight = 100 / $(".panelDate").length;
}

function populateBackground(id) {
    // randomize the order of the images
    backgroundImages.sort(function(){return (Math.round(Math.random())-0.5);});
    
    $(id).html("");
    
    for (var i=0; i<5; i++) {
        var code = '<img class="background" src="' + backgroundImages[i] + '"></img>';
        $(id).append(code);
    }
}

function animateBackground() {
    if ($("#background").is(":visible")) {
        $("#backgroundContainer").append('<div id="background2"></div>');
        //$("#background2").css({opacity: 0});
        $("#background2").css({left: $("#backgroundContainer").width()});
        populateBackground("#background2");
        $("#background").css({'z-index': 1});
        $("#background2").css({'z-index': 2});
        //$("#background2").animate({opacity: 1}, 1000, function() {
        $("#background").animate({left: (-1) * $("#backgroundContainer").width()}, 1000);
        $("#background2").animate({left: 0}, 1000, function() {
            $("#background").remove();
            setTimeout(animateBackground, 3000);
        });
    } else {
        $("#backgroundContainer").append('<div id="background"></div>');
        //$("#background").css({opacity: 0});
        $("#background").css({left: $("#backgroundContainer").width()});
        populateBackground("#background");
        $("#background2").css({'z-index': 1});
        $("#background").css({'z-index': 2});
        //$("#background").animate({opacity: 1}, 1000, function() {
        $("#background2").animate({left: (-1) * $("#backgroundContainer").width()}, 1000);
        $("#background").animate({left: 0}, 1000, function() {
            $("#background2").remove();
            setTimeout(animateBackground, 3000);
        });
    }
    
    /*var newTop = $("#background").position()['top'] - ($("#backgroundContainer").height() / 2);
    $("#background").animate({top: newTop}, 1000);
    setTimeout(animateBackground, 2000);*/
}

$(function(){
    /*if (navigator.platform.indexOf("iPad") == -1) {
        $.getScript("js/jquery.animate-enhanced.min.js");
    }*/
    
    
    // populate timeline with events and add the scale
    loadEvents();
    
    /*
    // make the timeline draggable
    $("#timeline").draggable({axis: 'y'});
    // stop any other movement while dragging
    $("#timeline").bind("dragstart", function(event, ui){
        $(this).stop();
    });
    $("#timeline").bind("dragstop", function(event, ui){
        // convert back to percentage from pixels
        blah = $(this).css("top").split("px")[0] / $(this).parent().height() * 100;
        $(this).css({top: blah + "%"});
        // animate back into view if scrolled off edge
        if ($("#timeline").position()["top"] > 0) {
            $("#timeline").animate({top: 0}, {duration: 500});
        } else if ($("#timeline").position()["top"] < 0 - $("#timeline").height() + $("#rightPanel").height()) {
            $("#timeline").animate({top: 0 - $("#timeline").height() + $("#rightPanel").height()}, {duration: 500});
        }
    });
    */
    
    // if modal background is clicked, clear and hide it
    $("#modal").click(function() {
        modal.clear();
        modal.hide();
    })
    
    // fixes display of timeline for Chrome
    if (navigator.userAgent.indexOf("Chrome") != -1) {
        $("body").addClass("chrome");
    }
    
    // presentation mode link
    $("#presentationLink").click(function () {
        $.getScript("presentation/presentation.js");
        return false;
    });
    
    $("*").click(function() {
        populateBackground();
    });

    animateBackground();
});