# -*- coding: utf-8 -*-
# @Author: li
# @Date:   2018-08-01 09:36:14
# @Last Modified by:   rick_li
# @Last Modified time: 2018-08-08 17:15:56
import os
import requests
import base64
import json



class APItest():
	def __init__(self, host, port):
		self.host = host
		self.port = port

	def video_upload(self, filepath, description):
		if not all([filepath, description]):
			return "invalid Parameters"

		if not os.path.exists(filepath):
			return "not found file: {}".format(filepath)

		url = "http://{}:{}".format(self.host, self.port) + "/api/lambda/pk/upload_movies/"
		files = {"file": open(filepath, "rb")}
		data = {
			"name": description,
		}

		response = requests.post(url, files=files, data=data)
		return response.text

	def image_search(self, filepath):
		if not all([filepath, ]):
			return "invalid Parameters"

		if not os.path.exists(filepath):
			return "not found file: {}".format(filepath)

		img = open(filepath, "rb")
		img_base64 = base64.b64encode(img.read())
		img.close()
		data = {
			'image_url': "data:image/png;base64,".encode() + img_base64,
		}

		url = "http://{}:{}".format(self.host, self.port) + "/api/search/"
		response = requests.post(url, data=data)
		return response.text

	def image_search_result_all(self):
		url = "http://{}:{}".format(self.host, self.port) + "/api/queriesset/?format=json"
		response = requests.get(url)
		return response.text

	def image_search_result(self, id):
		url = "http://{}:{}/api/lambda/{}/queriesresults/?format=json".format(self.host, self.port, id)
		response = requests.get(url)
		return response.text


if __name__ == "__main__":

    host = "192.168.31.106"
    port = 8000

    api_test = APItest(host, port)

    # 上传视频
    ret = api_test.video_upload("../test.mp4", "v6")
    print(ret)

    # 上传图片
    ret = api_test.image_search("../test.png")
    print(ret)

    # 查询所有结果
    ret = api_test.image_search_result_all()
    data = json.loads(ret)
    for item in data:
        item["image_data"] = "image_data"
        print(item)

    # 根据id查询结果
    ret = api_test.image_search_result(25)
    with open("ret.html", "w") as f:
        f.write(ret)
    data = json.loads(ret)
    for i, item in enumerate(data["result"]):
        # data["result"][i]["url"] = ""
        item["url"] = "url"
        data["result"] = [item, ]
        break
    print(data)






