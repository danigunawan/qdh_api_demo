var http = require('http');
var fs = require('fs');
var Path = require('path');
var querystring = require('querystring');
var DEBUG = false;

function video_upload(host, port, filepath, description, cb) {
    if (!fs.existsSync(filepath)) {
        return cb && cb("not found file: " + filepath)
    }
    if(!host || !port || !description) {
        return cb && cb("invalid Parameters")
    }
    var filename = Path.basename(filepath);
    var stat = fs.statSync(filepath);

    var options = {
        host: host,
        port: port,
        method: "POST",
        path: "/api/lambda/pk/upload_movies/"
    }

    var req = http.request(options, function(res){
        res.on("data", function(chunk){
            DEBUG && console.log("BODY:" + chunk);
        })
    })
    req.on('error', function(e){
        return cb && cb('problem with request:' + e.message)
    })

    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n----' + boundaryKey + '--';
    var content = "\r\n----" + boundaryKey + "\r\n" +
                  "Content-Type: application/octet-stream\r\n" +
                  '----' + boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="name"\r\n\r\n' +
                  description +
                  '----' + boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="scene"\r\n\r\n'+
                  '0' +
                  '----' + boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="nth"\r\n\r\n' +
                  '11' +
                  '----' + boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="rescale"\r\n\r\n' +
                  '11' +
                  '----'+ boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="csrfmiddlewaretoken"\r\n\r\n' +
                  'tBqqvVtb3EfgO95vr7jKQ5IEBSD4FAaPU0TMHFtJtyb68T7lHelgR38nIwSGLrrU' +
                  '----' + boundaryKey + '\r\n' +
                  'Content-Disposition: form-data; name="file"; filename=' + filename + '\r\n' +
                  'Content-Type: video/mp4\r\n\r\n';
    var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。

    var contentLength = contentBinary.length + stat.size;

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

    req.write(contentBinary);
    var fileStream = fs.createReadStream(filepath, {bufferSize : 4 * 1024});
    fileStream.pipe(req, {end: false});
    fileStream.on('end', function() {
        req.end(enddata);
        return cb && cb(null)
    });
}

function video_lists(host, port, cb) {
    if(!host || !port) {
        return cb && cb("invalid Parameters")
    }

    var options = {
        host: host,
        port: port,
        method: "GET",
        path: '/api/videos/',
        auth: "admin:super"
    }
    http.get(options,function(req2,res2){
      var html='';
      req2.on('data',function(data){
          html+=data;
      });
      req2.on('end',function(){
        //console.log('>>>  get ' + html)
        html = JSON.parse(html);
        return cb && cb(null, html)
      });
    });
}

function image_search(host, port, filepath, cb) {
    if(!host || !port || !filepath) {
        return cb && cb("invalid Parameters", null)
    }
    if (!fs.existsSync(filepath)) {
        return cb && cb("not found file: " + filepath, null)
    }

    var imageBuf = fs.readFileSync(filepath);
    var imageBuf_base64 = 'data:image/png;base64,' + imageBuf.toString("base64");

    var postData = querystring.stringify({
      'image_url': imageBuf_base64,
      'count': 100,
      'selected_indexers':'["2_1"]',
      'selected_detectors':'["3"]',
      'generate_tags':false,
      'csrfmiddlewaretoken':'KBmmGgN2MO6UvUKiVbqSvNKF6d8XfIiRRvVDdNAOPhqpfOvnsjnWQ9UvY3YBfhYp'
    });

    var options = {
        host: host,
        port: port,
        method: "POST",
        path: "/Search2",
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':postData.length
        }
    }

    var req = http.request(options, function(res){
        var html='';
        res.on("data", function(data){
            //console.log("BODY:" + chunk);
            html+=data;
        })
        res.on("end", function(){
            var json = JSON.parse(html);
            var ret = {
                target: "http://" + host + ":" + port + json.url,
                id: json.primary_key,
                results_len: json.results["Indexer facenet -> Exact facenet retriever"].length,
                results: json.results["Indexer facenet -> Exact facenet retriever"]
            }
            return cb && cb(null, ret);
        })
    })
    req.on('error', function(e){
        return cb && cb('problem with request:' + e.message, null)
    })
    req.write(postData);
}

function image_search_result_all(host, port, cb) {
    if(!host || !port) {
        return cb && cb("invalid Parameters")
    }

    var options = {
        host: host,
        port: port,
        method: "GET",
        path: '/api/queriesset/',
        auth: "admin:super"
    }
    http.get(options,function(req2,res2){
      var html='';
      req2.on('data',function(data){
          html+=data;
      });
      req2.on('end',function(){
        //console.log('>>>  get ' + html)
        html = JSON.parse(html);
        return cb && cb(null, html)
      });
    });
}

function image_search_result(host, port, id, cb) {
    if(!host || !port || !id) {
        return cb && cb("invalid Parameters")
    }

    var options = {
        host: host,
        port: port,
        method: "GET",
        path: '/api/lambda/' + id + '/queriesresults/',
        auth: "admin:super"
    }
    http.get(options,function(req2,res2){
      var html='';
      req2.on('data',function(data){
          html+=data;
      });
      req2.on('end',function(){
        //console.log('>>>  get ' + html)
        html = JSON.parse(html);
        return cb && cb(null, html)
      });
    });
}

module.exports = {
  video_upload : video_upload,
  video_lists : video_lists,
  image_search : image_search,
  //image_search_result_all : image_search_result_all,
  image_search_result : image_search_result
}
