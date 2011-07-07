var EMBED_LINK = "http://wrldsuksgo2mars.doesntexist.org:8888/embed?app="

String.prototype.startsWith = function(prefix){
    return this.lastIndexOf(prefix, 0) === 0;
}

function getQueryVariable(variable, location) {
    var query = location.split("?", 2);
    if(query.length != 2)
        return undefined;
    query = query[1];
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
            iframe.setAttribute("src", url);
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "300");
            
	        var replace = div.parentNode;
	        var parent = replace.parentNode;
            parent.insertBefore(iframe, replace);
            parent.removeChild(replace);
	    }
	}
	
	window.setTimeout(checkForLinks, 5000);
}
window.setTimeout(checkForLinks, 1000);
