var api = require('./libs/qdh_api');

var host = "192.168.3.8";
var port = 8000;

console.log(">>> uploading video");
api.video_upload(host, port, "../citest.mp4", "测试视频2", function(err) {
    if(err) {
        return console.log(err)
    }
    console.log(">>> uploaded");
})
