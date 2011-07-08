var EMBED_LINK = "http://mobisocial.stanford.edu:8888/embed?"

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
	        var iframe = document.createElement("iframe");
	        var url = getQueryVariable("app", data_content_url);
	        alert(data_content_url + "\n" + url);
            iframe.setAttribute("src", url);
            iframe.setAttribute("frameborder", 0);
	        var width = getQueryVariable("width", data_content_url);
            if(width != undefined)
                iframe.setAttribute("width", width);
            else
                iframe.setAttribute("width", "100%");
	        var height = getQueryVariable("height", data_content_url);
            if(height != undefined)
                iframe.setAttribute("height", height);
            else
                iframe.setAttribute("height", "260");
            
	        var replace = div.parentNode;
	        var parent = replace.parentNode;
	        
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
            parent.insertBefore(iframe, replace);
            parent.removeChild(replace);
	    }
	}
	
	window.setTimeout(checkForLinks, 5000);
}
window.setTimeout(checkForLinks, 1000);
