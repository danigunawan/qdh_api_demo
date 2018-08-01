var api = require('./libs/qdh_api');

var host = "192.168.3.8";
var port = 8000;

console.log(">>> uploading video");
api.video_upload(host, port, "../test.mp4", "测试视频2", function(err) {
    if(err) {
        return console.log(err)
    }
    console.log(">>> uploaded");
})

console.log(">>> video lists");
api.video_lists(host, port, function(err, videos) {
    console.log("     ---- total videos: " + videos.length)
    for(i=0;i<videos.length;i++) {
        console.log("     ---- " + videos[i].name + ' id=' + videos[i].id)
    }
})

console.log(">>> image search");
api.image_search(host, port, "../test.png", function(err, result) {
    if(err) {
        return console.log(err)
    }
    console.log("     ---- 目标: " + result.target)
    console.log("     ---- 本次搜索的ID: " + result.id)
    console.log("     ---- 共搜索到的次数: " + result.results_len)

    console.log(">>> image search results");
    api.image_search_result(host, port, result.id, function(err, result2) {
       for(i=0; i<result2.result.length; i++) {
         item = result2.result[i];
         console.log("     ---- 视频名字: " + item.video_name + "\t视频链接 " + item.mp4url + "\t的第" + item.t + "秒" + "\t截图是"  + item.frameurl + "\tdistance是" + item.distance)
       }
    })
})
