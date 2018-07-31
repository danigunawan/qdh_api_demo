var http = require('http');
var fs = require('fs');
var fs = require('path');

function video_upload(host, port, path, filepath, cb) {
    if(!host || !port || !path) {
        return cb && cb("invalid Parameters")
    }

   var filename = path.basename(filepath);

    var boundaryKey = '----' + new Date().getTime();    // 用于标识请求数据段
    var options = {
        host: host,
        port: port,
        method: 'POST',
        path: path,
        headers: {
            'Content-Type': 'multipart/form-data; boundary=' + boundaryKey,
            'Connection': 'keep-alive'
        }
    };
    var req = http.request(options, function(res){
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            console.log('body: ' + chunk);
        });

        res.on('end', function() {
            console.log('res end.');
        });
    });
    /*req.write(
         '--' + boundaryKey + 'rn' +
         'Content-Disposition: form-data; name="upload"; filename="test.txt"rn' +
         'Content-Type: text/plain'
     );*/
    req.write(
        `--${boundaryKey}rn Content-Disposition: form-data; name="${self.path}"; filename="${self.file}"rn Content-Type: text/plain`
    );

    // 创建一个读取操作的数据流
    let fileStream = fs.createReadStream(filepath);
    fileStream.pipe(req, {end: false});
    fileStream.on('end', function() {
        req.end('rn--' + boundaryKey + '--');
        return cb&& cb(null);
    });
}


var host = '192.168.3.8'
var port = 8000;
var path = '/api/lambda/pk/upload_movies/'
video_upload(host, port, path, 'citest.mp4', function(err) {

});
