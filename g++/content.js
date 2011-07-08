var EMBED_LINK = "http://mobisocial.stanford.edu:8888/embed?"
var JAIL_LINK = "http://mobisocial.stanford.edu:8888/jail?"
var CAJA = true;

String.prototype.startsWith = function(prefix){
    return this.lastIndexOf(prefix, 0) === 0;
}

function getQueryVariable(variable, location) {
    if(location.indexOf("?") == -1)
        return undefined;
    var query = location.substring(location.indexOf("?") + 1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
var checkForLinks = function() {
    var divs = document.documentElement.getElementsByTagName("div");
    for(var i = 0; i < divs.length; ++i) {
        var div = divs[i];
        var data_content_url = div.getAttribute("data-content-url");
        if(data_content_url === null)
            continue;
        if(data_content_url.startsWith(EMBED_LINK)) {
            // get params
            var app_url = getQueryVariable("app", data_content_url);
            var replace = div.parentNode;
            var parent = replace.parentNode;
            
            //remove the junk in the main post that tries to let the picture be removed
            if(parent) {
                var next = parent.nextSibling;
                if(next != null && next.getAttribute("tabindex") !== null) {
                    //skip the tab index
                    next = next.nextSibling;
                    if(next) {
                        //skip the embed cancel
                        next = next.nextSibling;
                        while(next != null) {
                            var me = next;
                            next = next.nextSibling;
                            me.parentNode.removeChild(me);
                        }
                    }
                }
            }
            var jail = null;
            //create an iframe for compatibility
            jail = document.createElement("iframe");
            if(CAJA) {
                jail.setAttribute("src", data_content_url.replace(EMBED_LINK, JAIL_LINK));
            } else {
                jail.setAttribute("src", app_url);
            }
            jail.setAttribute("frameborder", 0);
            //common props
            var width = getQueryVariable("width", data_content_url);
            if(width != undefined)
                jail.setAttribute("width", width);
            else
                jail.setAttribute("width", "100%");
            var height = getQueryVariable("height", data_content_url);
            if(height != undefined)
                jail.setAttribute("height", height);
            else
                jail.setAttribute("height", "260");

            parent.insertBefore(jail, replace);
            parent.removeChild(replace);
        }
    }
    
    window.setTimeout(checkForLinks, 5000);
}

window.setTimeout(checkForLinks, 1000);
