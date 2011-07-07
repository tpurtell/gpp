// embed.png source http://en.wikipedia.org/wiki/File:Holliday_Junction.png
var PORT = 8888;
var REDIRECT = "http://openjunction.org/";
var SERVER = "http://mobisocial.stanford.edu:8888"
var STORE_URL = "https://chrome.google.com/webstore/detail/moiabiocelcpgljnpgbjfeljkmeacnnd"
String.prototype.startsWith = function(prefix){
    return this.lastIndexOf(prefix, 0) === 0;
}
String.prototype.endsWith = function(suffix){
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

var http = require('http');
var url = require('url');
var fs = require('fs');

var ejs = require('../ejs');

console.log('Loading embed template...');
var embed_template = ejs.compile(fs.readFileSync('embed.ejs', 'utf8'));

console.log('Loading embed image...');
var embed_image = fs.readFileSync('embed.png');

console.log('Loading plugin...');
var embed_crx = fs.readFileSync('g++.crx');

http.createServer(function (req, res) {
    if(req.url.startsWith('/embed')) {
        var referer = req.headers['referer'];
        if(referer == undefined)
            referer = "";
        var user_agent = req.headers['user-agent'];
        if(user_agent == undefined)
            user_agent = "";

        if(referer.startsWith("http://plus.google.com") && user_agent.indexOf(' Chrome/') != -1) {
            if(STORE_URL != undefined) {
                res.writeHead(302, {'Location': STORE_URL});
                res.end();
            } else {
                //return the extension on a click from g+ ui
                res.writeHead(200, {'Content-Type': 'application/x-chrome-extension'});
                res.end(embed_crx);
            }
            return;
        }
        var query = url.parse(req.url, true).query;
        if(!referer.startsWith("http://plus.google.com")) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(
                embed_template({
                    app:encodeURIComponent(query.app), 
                    server:SERVER
                }));
        } else {
            res.writeHead(302, {'Location': STORE_URL});
            res.end();
        }
    } else if(req.url.startsWith('/image')) {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(embed_image);
    } else if(req.url.startsWith('/extension')) {
        if(STORE_URL != undefined) {
            res.writeHead(302, {'Location': STORE_URL});
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/x-chrome-extension'});
            res.end(embed_crx);
        }
    } else if(req.url.length <= 1){
        res.writeHead(302, {'Location': REDIRECT});
        res.end();
    } else {
        res.writeHead(404);
        res.end("Not found!");
    }
}).listen(PORT);

console.log('Server running at http://*:' + PORT + '/');