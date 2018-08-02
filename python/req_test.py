# -*- coding: utf-8 -*-
# @Author: li
# @Date:   2018-08-01 09:36:14
# @Last Modified by:   li
# @Last Modified time: 2018-08-02 11:39:15
import requests
import base64

BASE_URL = "http://192.168.31.153:8000"

def video_upload():
	url = BASE_URL + "/api/lambda/pk/upload_movies/"
	files = {"file": open("../test.mp4", "rb")}
	data = {
		"name": "test",
		# "scene": True,
		"nth": 1
	}

	response = requests.post(url, files=files, data=data)
	return response.text

def image_search():
	img = open("../test.png", "rb")
	img_base64 = base64.b64encode(img.read())
	img.close()

	print(type(img_base64))

	data = {
		'image_url': "data:image/png;base64,".encode() + img_base64,
		'count': 20,
		'selected_indexers':'["2_1"]',
		'selected_detectors':'["1"]',
		'generate_tags':"false",
		'csrfmiddlewaretoken':'9OyeJGolnVMywTMSvnAIrZdAZWY14PdRf7BolLDFLc6mWrYPny4N0AxMeCfl0exq'
	}

	url = BASE_URL + "/Search2"
	response = requests.post(url, data=data)
	return response.text

if __name__ == "__main__":
	# ret = video_upload()
	# print(ret)

	search_resutl = image_search()
	page = open("list.html", "w")
	page.write(search_resutl)
	page.close()
