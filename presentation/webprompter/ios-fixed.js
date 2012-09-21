// http://www.hand-interactive.com/resources/detect-mobile-javascript.htm
// http://stackoverflow.com/questions/743123/fixed-positioning-in-mobilesafari

$(function() {
    var uagent = navigator.userAgent.toLowerCase();
    if (uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("ipad") > -1) {
        alert("Auto-scrolling is dysfunctional on iOS. Entered manual mode, only zoom controls in the lower left work.");
        $(".button, #time, #infocontainer").hide();
        $("#smaller, #larger").show();
        $("#controls").css("top", (window.pageYOffset  + window.innerHeight - 50) + 'px');
        //window.onscroll = function() {
        $(window).scroll(function() {
            //document.getElementById('infocontainer').style.top = (window.pageYOffset) + 'px';
            //document.getElementById('controls').style.top = (window.pageYOffset  + window.innerHeight - 50) + 'px';
            newtop = (window.pageYOffset  + window.innerHeight - 50) + 'px';
            $("#controls").animate({"top": newtop}, 200);
        //};
        });
    }
});