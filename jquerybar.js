/*Copyright 2012 Jaspreet Chahal
 http://jaspreetchahal.org/

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Donations are welcome! or a purchase is appreciated if you are using it commercially
 */
jQuery.fn.jquerybar = function (settings) {
    var settings = jQuery.extend({
        //notificationArea
        notificationAreaHeight:55, // minimum 40 recommended. enforced 40 if below 40
        notificationAreaCollapsedHeight:10,
        notificationAreaCollapsedBarBackground:"#f1f1f1",
        notificationAreaPadding:10,
        notificationAreaBackground:"#6174c3",
        notificationAreaBorderSize:4,
        notificationAreaBorderColor:"#6174c3",
        notificationAreaBorderRadius:8,
        notificationAreaPosition:"fixed-top", // fixed-top|fixed-bottom|document-top
        notificationAreaShadow:true,
        notificationAreaShadowColor:"#000",
        notificationAreaInitialDisplay:'delayed', // delayed|expanded|collapsed
        notificationAreaDelay:2000, // 2 seconds
        notificationAreaBorderAnimationWhenShown:true, // a border color animation will be performed
        notificationAreaEasing:'easeOutQuad', // more options from this page http://jqueryui.com/effect/
        notificationAreaAutoHide:false,
        notificationAreaAutoHideDelay:15000, // 15 seconds
        notificationAreaZIndex:999,
        hideAction:'collapse', // collapse | hide
        keepHiddenOnRefreshIfUserHides:false, // depends on if cookies are enabled or not
        attentionSeeker:false,
        attentionSeekerColor:"#6174c3",
        // maximum notification length in number of characters is 150 including anchor tags
        // maximum notification length in number of characters is 85 including anchor tags if you are targeting mobile devices
        notifications:[],
        links:[],
        linkTexts:[],
        linkOnNewLine:true,
        notificationSlideInterval:5000,//15 seconds
        notificationAreaAdjustBodyMargins:true,
        //fontStyles
        textFontFamily:'Georgia,Times New Roman,Times,serif',
        textFontSize:14,
        textColor:"#FFF",
        textShadow:'none', // none | indent | normal
        textShadowColor:"#f1f1f1",
        // link Styles
        linkFontFamily:'Georgia,Times New Roman,Times,serif',
        linkFontSize:11,
        linkPadding:5,
        linkBackground:'#c00',
        linkColor:"#ffffff",
        linkShadow:'none', // none | indent | normal
        linkShadowColor:"#f1f1f1",
        linkTextDecoration:'none', // none | underline
        // youtube video
        youtubeVideoCode:"",
        youtubeVideoWidth:180,
        youtubeVideoHeight:136,
        youtubeAutoPlay:false,
        youtubeAllowFullScreen:false,
        youtubePlayerControls:true,
        // social
        includeSocial:true,
        socialFollowFacebook:"",
        socialFollowTwitter:"",
        socialFollowLinkedin:"",
        socialFollowGoogleplus:"",
        socialFollowRss:"",
        // applies to social and youtube area
        hideSocialYoutubeLowResolutions:true,
        // powered by
        showPoweredBy:true
    }, settings);

    // quickly check if we got enough room to render our notification bar properly
    if(parseInt(settings.notificationAreaHeight) < 40) {
        settings.notificationAreaHeight = 40;
    }
    var originalHeight = settings.notificationAreaHeight;

    function uniqID(length) {
        var chars = '_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
        if (!length) {
            length = Math.floor(Math.random() * chars.length);
        }
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        if (jQuery("#" + str).length == 0)
            return str;
        else
            return uniqID(20)
    }
    function getCookie(c_name)
    {
        var i,x,y,ARRcookies=document.cookie.split(";");
        for (i=0;i<ARRcookies.length;i++)
        {
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name)
            {
                return unescape(y);
            }
        }
    }
    var currentFlipObject = null;
    var currentFlipCounter = 0;
    function flipper() {

        if(jQuery("div.jcnotify-flipper").length <= 1) return;
        if(jQuery("div.jcnotify-flipper").length == currentFlipCounter) currentFlipCounter = 0;
        //console.log(jQuery("div.jcnotify-flipper").length+" - "+currentFlipCounter);
        if(currentFlipCounter == 0) {
            jQuery("div.jcnotify-flipper").slideDown();
        }
        currentFlipObject = jQuery("div.jcnotify-flipper").eq(currentFlipCounter);
        setTimeout(function(){
            currentFlipObject.slideUp();
            currentFlipCounter++;
            flipper();
        },settings.notificationSlideInterval)
    }
    $bodyadjust_margins = 'margin-top';

    var shadow = settings.notificationAreaShadow ? 'box-shadow: 0px 0px 10px 1px' + settings.notificationAreaShadowColor + ';' : '';
    if(!settings.notificationAreaShadow) {
        shadow = "";
    }
    var position = "position: fixed;top:0;left:0;right:0;border-top:none !important;";
    var borderradius = 'border-radius:0px  0px ' + settings.notificationAreaBorderRadius + 'px ' + settings.notificationAreaBorderRadius + 'px;';

    if (settings.notificationAreaPosition == "fixed-bottom" || settings.notificationAreaPosition == 'document-bottom') {
        borderradius = 'border-radius:' + settings.notificationAreaBorderRadius + 'px ' + settings.notificationAreaBorderRadius + 'px 0px  0px; ';
    }
    if(parseInt(settings.notificationAreaBorderRadius) == 0) {
        borderradius = "";
    }
    if (settings.notificationAreaPosition == "fixed-bottom") {
        position = "position: fixed;bottom:0;left:0;right:0;border-bottom:none !important";
        $bodyadjust_margins = 'margin-bottom';
    }
    else if (settings.notificationAreaPosition == 'document-bottom') {
        position = "position: relative;bottom:0;left:0;right:0;border-bottom:none !important";
    }
    else if (settings.notificationAreaPosition == 'document-top') {
        position = "position: absolute;top:0;left:0;right:0;border-top:none !important";
    }
    // youtube stuff
    var youtube = "";
    var embedcode = settings.youtubeVideoCode;
    var allowfullscreen = settings.youtubeAllowFullScreen?'allowfullscreen':'';
    var autoplay = settings.youtubeAutoPlay?'autoplay=1&':'';
    var youtubeplayercontrols = settings.youtubePlayerControls?'controls=2&':'controls=0';
    if(embedcode) {
        youtube = '<iframe style="margin:0 auto" width="'+settings.youtubeVideoWidth+'" height="'+settings.youtubeVideoHeight+'" src="http://www.youtube.com/embed/'+embedcode+'?'+autoplay+youtubeplayercontrols+'" frameborder="0"  '+allowfullscreen+' ></iframe>';
    }
    // create a unique ID for our DIV
    var currentElID = uniqID();
    var currentElIDHashed = "#" + currentElID;

    var html = jQuery('<div id="' + currentElID + '" style="display:none;border-top:' + settings.notificationAreaBorderSize + 'px ' + settings.notificationAreaBorderColor + ' solid;border-bottom:' + settings.notificationAreaBorderSize + 'px ' + settings.notificationAreaBorderColor + ' solid;' + position + ' z-index:' + settings.notificationAreaZIndex + ';height:' + settings.notificationAreaHeight + 'px;background-color: ' + settings.notificationAreaBackground + '; ' + shadow + 'width:100%;box-sizing: padding:0;margin:0;' + borderradius + ' ">' +
        '<div class="jcnotify-hchild jcnotify_area1" id="jcnotify_area1-' + currentElID + '"  style="width:20%;min-width:240px;float:left;box-sizing: border-box;text-align:center;position: relative;"><div style="padding:' + settings.notificationAreaPadding + 'px">'+youtube+'</div></div>' +
        '<div class="jcnotify-hchild jcnotify_area2" id="jcnotify_area2-' + currentElID + '"  style="width:60%;min-width:520px;float:left;box-sizing: border-box;position: relative;height:'+settings.notificationAreaHeight+'px;overflow:hidden;text-align:center"></div>' +
        '<div class="jcnotify-hchild jcnotify_area3" id="jcnotify_area3-' + currentElID + '"  style="width:20%;max-width:250px;;max-height:'+(settings.notificationAreaHeight-settings.notificationAreaBorderSize)+'px;box-sizing: border-box;position: absolute;margin-bottom:3px;text-align:right"></div>' +
        '<div class="jcnotify-hchild" style="clear: both; "></div>' +
        '<div  id="areajcnotify-bar-hidden" style="display: none;box-shadow:0px 1px 8px 1px #666;background: '+settings.notificationAreaCollapsedBarBackground+';'+position+'border:1px solid; width:250px;margin:0 auto;cursor:pointer;height:18px; text-align:center;"><img src="./imgs/down.png"></div>'+
        '</div>'
    ).appendTo('body');

    var collapsed = false;
    var social = "";
    $root  = jQuery(currentElIDHashed);
    $jcnotify_area1 = jQuery("#jcnotify_area1-"+currentElID);
    $jcnotify_area2 = jQuery("#jcnotify_area2-"+currentElID);
    $jcnotify_area3 = jQuery("#jcnotify_area3-"+currentElID);
    $bar = jQuery("#areajcnotify-bar-hidden");
    if(youtube.length >0) {
        $root.css('height',(settings.youtubeVideoHeight+20)+'px');
    }
    else {
        $jcnotify_area1.height(1);
    }
    $containerOuterHeight = $root.outerHeight(true)+20;

    // adjust body height if required

    if(settings.notificationAreaAdjustBodyMargins)
        jQuery('body').css($bodyadjust_margins,(parseInt(jQuery('body').css($bodyadjust_margins))+$containerOuterHeight+parseInt($bar.height()))+"px");

    //powered by
    if(settings.showPoweredBy) {
        $root.append('<div style="font-family: arial;font-size: 9px;color:#eee;text-align: right;height:9px;position:absolute;right:15px;bottom:-'+(parseInt(settings.notificationAreaBorderSize)+9)+'px;">Powered by <a href="http://jaspreetchahal.org" style="color:#eee">jcnotify</a></div>');
    }

     // Content
    var socialStyle = "margin:0;padding:0;margin-top:3px;margin-right:5px; display:inline-block;height:21px;width:21px;background:#34b7eb;border:#1babe4 2px solid;border-radius:21px;text-align:center";
    var hideshow_btn = '<span id="areabtn-'+currentElID+'" style="'+socialStyle+';width:21px;height:21px;float:right;background:#666;border:#666 2px solid;background-image: url(./imgs/buttons.png);background-position:0px 0px;cursor: pointer">&nbsp</span>';
    if(settings.socialFollowTwitter.length > 0) {
        social += "<a href='"+settings.socialFollowTwitter+"' target='_blank' style='"+socialStyle+"'><img style='border:none;width:20px;height:20px' src='./imgs/twitter_16.png'></a>";
    }
    if(settings.socialFollowFacebook.length > 0) {
        social += "<a href='"+settings.socialFollowFacebook+"' target='_blank' style='"+socialStyle+"'><img style='border:none;width:20px;height:20px' src='./imgs/facebook_16.png'></a>";
    }
    if(settings.socialFollowGoogleplus.length > 0) {
        social += "<a href='"+settings.socialFollowGoogleplus+"' target='_blank' style='"+socialStyle+"'><img style='border:none;width:20px;height:20px' src='./imgs/googleplus.png'></a>";
    }
    if(settings.socialFollowLinkedin.length > 0) {
        social += "<a href='"+settings.socialFollowLinkedin+"' target='_blank' style='"+socialStyle+"'><img style='border:none;width:20px;height:20px' src='./imgs/linkedin.png'></a>";
    }
    if(settings.socialFollowRss.length > 0) {
        social += "<a href='"+settings.socialFollowRss+"' target='_blank' style='"+socialStyle+"'><img style='border:none;width:20px;height:20px' src='./imgs/rss_16.png'></a>";
    }
    if(social.length>0) {
        social = "<span class='jcnotify-social' style='display:inline-block;float:left;margin-top:0px;'>"+social+"</span>";
    }


    if(settings.includeSocial)
        $root.find(".jcnotify_area3").prepend(social);
    $jcnotify_area3.append(hideshow_btn);
    $jcnotify_area3.css("margin-top",((Math.floor(settings.notificationAreaHeight/2) - 25)));

    $updownbutton =jQuery("#areabtn-"+currentElID);



    var notifications = "";
    var linkshadow = "text-shadow:none",textshadow = "text-shadow:none";
    if(settings.textShadow == 'normal') {
        textshadow = "text-shadow: -1px -1px white, 1px 1px "+settings.textShadowColor+";";
    }
    else if(settings.textShadow == 'indent') {
        textshadow = "text-shadow: 1px 1px white, -1px -1px "+settings.textShadowColor+";";
    }
    if(settings.linkShadow == 'normal') {
        linkshadow = "text-shadow: -1px -1px white, 1px 1px "+settings.linkShadowColor+";";
    }
    else if(settings.linkShadow == 'indent') {
        linkshadow = "text-shadow: 1px 1px white, -1px -1px "+settings.linkShadowColor+";";
    }
    var linkbreak = settings.linkOnNewLine?'<br>':'';
    // notification messages
    jQuery.each(settings.notifications, function(i,msg){
        link = settings.links[i];
        linktext = settings.linkTexts[i];
        if(!linktext){
            linktext = link;
        }
        if(link){
            link = linkbreak+'<a href="'+link+'" target="_blank" style="margin:3px 3px 3px 0px;display:inline-block;background:'+settings.linkBackground+';border-radius:5px;padding:'+settings.linkPadding+'px;position:relative;top:-1px;text-decoration:'+settings.linkTextDecoration+';font-family: '+settings.linkFontFamily+';font-size:'+settings.linkFontSize+'px;color:'+settings.linkColor+';'+linkshadow+'">'+linktext+'</a>';
        }
        notifications+="<div style='width:100%;text-align:center !important;height:"+settings.notificationAreaHeight+"px;box-sizing: border-box;font-family: "+settings.textFontFamily+";font-size:"+settings.textFontSize+"px;color:"+settings.textColor+";"+textshadow+"' class='jcnotify-flipper'><table style='width:100%'><tr><td style='width:100%;text-align:center;height:"+settings.notificationAreaHeight+"px;vertical-align:middle;'>"+msg+" "+link+"</td></tr></table></div>";

    });
    $jcnotify_area2.append(notifications);

    // button actions and hover effect
    $updownbutton.mouseenter(function(){
        if(settings.notificationAreaPosition == "fixed-bottom") {
            jQuery(this).css("background-position"," 0px  -22px");
        }
        else {
            jQuery(this).css("background-position"," 0px  -1px");
        }
    })
        .mouseleave(function(){
            if(settings.notificationAreaPosition == "fixed-bottom") {
                jQuery(this).css("background-position"," 0px  -21px");
            }
            else {
                jQuery(this).css("background-position"," 0px  0px");
            }
        }).click(function(){
            collapse();
        });
    if(settings.notificationAreaPosition == "fixed-bottom") {
        $updownbutton.css("background-position"," 0px  -21px");
    }

    var realHeight = $root.outerHeight(true);
    $root.css('box-sizing','border-box');
    // border animation
    function borderAnimation(el,attentionSeeker) {
        if (settings.notificationAreaBorderAnimationWhenShown || attentionSeeker != undefined) {
            el.animate({borderTopColor:settings.attentionSeekerColor, borderLeftColor:settings.attentionSeekerColor, borderRightColor:settings.attentionSeekerColor, borderBottomColor:settings.attentionSeekerColor}, 1000)
                .animate({borderTopColor:settings.notificationAreaBorderColor,
                    borderLeftColor:settings.notificationAreaBorderColor,
                    borderRightColor:settings.notificationAreaBorderColor,
                    borderBottomColor:settings.notificationAreaBorderColor}, 1000);
        }
    }


    // collapse it
    function collapse() {
        if(settings.hideAction == 'hide') {
            $root.children(".jcnotify-hchild").hide();
            $root.slideUp(500,function(){
                if(settings.notificationAreaAdjustBodyMargins)
                    jQuery('body').css($bodyadjust_margins,(parseInt(jQuery('body').css($bodyadjust_margins))-$containerOuterHeight)+"px");
            });
        }
        else {
            if(settings.notificationAreaPosition == "fixed-bottom") {
                $bar.css('border-bottom','none')
                $bar.css('border-radius','8px 8px 0px 0px ');
                $bar.find('img').attr('src','./imgs/up.png');
            }
            else  {
                $bar.css('border-top','none');
                $bar.css('border-radius','0px 0px 8px 8px');
                $bar.find('img').attr('src','./imgs/down.png');
            }
            $root.animate({height:realHeight}, 500,function(){})
                .animate({height:settings.notificationAreaCollapsedHeight}, 500, function () {
                    $root.children(".jcnotify-hchild").hide();
                    collapsed = true;
                    $bar.slideDown();
                    if(settings.notificationAreaAdjustBodyMargins)
                        jQuery('body').css($bodyadjust_margins,(parseInt(jQuery('body').css($bodyadjust_margins))-$containerOuterHeight)+"px");
                });
        }
        if(settings.keepHiddenOnRefreshIfUserHides) {
            document.cookie="jcnotify=no_load";
        }

    }

    function expand() {

        $root.animate({
            height:realHeight
        }, 500, function () {
            collapsed = false;
            $bar.slideUp();
            $root.children(".jcnotify-hchild").show();
            hideOnLowResolution();
        });
        if(settings.notificationAreaAdjustBodyMargins)
            jQuery('body').css($bodyadjust_margins,(parseInt(jQuery('body').css($bodyadjust_margins))+$containerOuterHeight)+"px");


    }
    function hideOnLowResolution() {
        if(settings.hideSocialYoutubeLowResolutions) {
            jQuery(".jcnotify-social").show();
            $jcnotify_area1.show();
            $jcnotify_area2.children().css("width","100%");
            if(jQuery(window).width() < 1000) {
                jQuery(".jcnotify-social").hide();
            }
            if(jQuery(window).width() < 800) {
                $jcnotify_area1.hide();
            }
            if(jQuery(window).width() < 800 && jQuery(document).width() > 400) {
                $jcnotify_area2.children().css("width","80%");
                $jcnotify_area2.css("overflow","hidden");
            }
        }
    }
    // display delayed|expanded|collapsed
    if (settings.notificationAreaInitialDisplay == "delayed") {
        setTimeout(function(){
            $root.slideDown({easing:settings.notificationAreaEasing, duration:700, complete:function () {
                borderAnimation($root);
            }});
        },settings.notificationAreaDelay);
    }
    else if (settings.notificationAreaInitialDisplay == "expanded") {
        $root.show(0,function () {
            borderAnimation($root);
        });
    }
    else if (settings.notificationAreaInitialDisplay == "collapsed") {
        $root.show(0, function () {
            collapse();
        });
    }

    // render the buttons or bar

    // handle hover when notification bar is collapsed
    $bar.mouseenter(function(){
        if(collapsed && settings.notificationAreaPosition != 'document-top') {
            $root.stop(false,false)
                .animate({height:$root.outerHeight(true)+12}, 150);
        }
    }).mouseleave(function(){
            if(collapsed && settings.notificationAreaPosition != 'document-top') {
                $root.stop(false,false)
                    .animate({height:settings.notificationAreaCollapsedHeight}, 150);
            }
        }).click(function(){
            expand();
        });
    // autohide handler
    if(settings.notificationAreaAutoHide) {
        setTimeout(function(){collapse();},settings.notificationAreaAutoHideDelay);
    }
    // attention seeker
    if(settings.attentionSeeker) {
        setInterval(function(){borderAnimation($root,'seekattention')},15000);
    }
    // adjust margins

    $jcnotify_area3.css("top",Math.round(($root.outerHeight(true)-$jcnotify_area3.outerHeight(true))/2.5)+"px");
    $jcnotify_area3.css("right","5px");
    $jcnotify_area2.css("margin-top",Math.round(($root.outerHeight(true)-$jcnotify_area2.outerHeight(true))/2.5));
    // keep it hidden if settings.keepHiddenOnRefreshIfUserHides is set to true
    if(getCookie("jcnotify")) {
        $root.hide();
    }
    flipper();
    jQuery(window).resize(function(){
        setTimeout(hideOnLowResolution,150);
    });
    hideOnLowResolution();
};

