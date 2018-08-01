## 千岛湖API接口调用
### Nodejs：

- [x]  上传视频文件
- [ ]  获取视频文件列表/处理状态 (这个目前需要认证)
- [x]  上传图片进行搜索
- [x]  获得搜索列表
- [x]  获得搜索的详细信息

### Nodejs执行测试代码：
```
$ cd nodejs/
$ npm install
$ npm start

>>> uploading video
>>> uploaded
>>> video lists
     ---- total videos: 1
     ---- citest id=1
>>> image search
     ---- 目标: http://192.168.3.8:8000/media/queries/6.png
     ---- 本次搜索的ID: 6
     ---- 共搜索到的次数: 60
>>> image search results
     ---- 视频名字: 测试视频2	视频链接 /media/3/video/3.mp4	的第2.2352秒	截图是/media/3/frames/66.jpg	distance是0.415942158345252
     ---- 视频名字: 测试视频2	视频链接 /media/3/video/3.mp4	的第1.6346秒	截图是/media/3/frames/48.jpg	distance是0.44502336225278
     ---- 视频名字: 测试视频2	视频链接 /media/3/video/3.mp4	的第1.868167秒	截图是/media/3/frames/55.jpg	distance是0.453427616576499
     ---- 视频名字: 测试视频2	视频链接 /media/3/video/3.mp4	的第2.602233秒	截图是/media/3/frames/77.jpg	distance是0.515891759920283
     ...
```


### Python：

- [ ]  上传视频文件
- [ ]  获取视频文件列表/处理状态
- [ ]  上传图片进行搜索
- [ ]  获得搜索列表
- [ ]  获得搜索的详细信息

### Python执行测试代码：
```
```
