# -*- coding: utf-8 -*-
# @Author: li
# @Date:   2018-08-01 09:36:14
# @Last Modified by:   li_coder
# @Last Modified time: 2018-08-08 17:15:56
import os
import requests
import base64
from lxml import etree
import time

class APItest():
	def __init__(self, host, port):

		self.host = host
		self.port = port
		self.headers = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
		}
		self.session = requests.session()

		rep = self.session.get("http://{}:{}/".format(self.host, self.port), headers=self.headers)
		html = etree.HTML(rep.text)
		self.csrftoken = html.xpath('//input[@name="csrfmiddlewaretoken"]/@value')[0]
		# print(csrftoken)
		data = {
			"username": "admin", 
			"password": "super",
			"csrfmiddlewaretoken": self.csrftoken
		}
		self.session.post("http://{}:{}/accounts/login/".format(self.host, self.port), data=data)

	def video_upload(self, filepath, description):
		if not all([filepath, description]):
			return "invalid Parameters"

		if not os.path.exists(filepath):
			return "not found file: {}".format(filepath)

		url = "http://{}:{}".format(self.host, self.port) + "/api/lambda/pk/upload_movies/"
		# files = {"file": open("../test.mp4", "rb")}
		files = {"file": open(filepath, "rb")}
		data = {
			"name": description,
			# "scene": True,
			"nth": 1,
			# "csrfmiddlewaretoken": self.csrftoken
		}

		response = requests.post(url, files=files, data=data)
		return response.text

	def image_search(self, filepath):
		if not all([filepath, ]):
			return "invalid Parameters"

		if not os.path.exists(filepath):
			return "not found file: {}".format(filepath)

		# img = open("../test.png", "rb")
		img = open(filepath, "rb")
		img_base64 = base64.b64encode(img.read())
		img.close()

		# print(type(img_base64))

		data = {
			'image_url': "data:image/png;base64,".encode() + img_base64,
			'count': 20,
			'selected_indexers':'["2_1"]',
			'selected_detectors':'["1"]',
			'generate_tags':"false",
			'csrfmiddlewaretoken':self.csrftoken
		}

		url = "http://{}:{}".format(self.host, self.port) + "/Search2"
		response = self.session.post(url, data=data)
		return response.text

	def image_search_result_all(self):
		url = "http://{}:{}".format(self.host, self.port) + "/api/queriesset/?format=json"
		response = self.session.get(url)
		return response.text

	def image_search_result(self, id):
		url = "http://{}:{}/api/lambda/{}/queriesresults/?format=json".format(self.host, self.port, id)
		response = self.session.get(url)
		return response.text


if __name__ == "__main__":

	host = "192.168.31.153"
	port = 8000
	
	api_test = APItest(host, port)

	ret = api_test.video_upload("../test.mp4", "api_test1")
	print(ret)

	ret = api_test.image_search("../test.png")
	print(ret)

	ret = api_test.image_search_result_all()
	print(ret)

	ret = api_test.image_search_result(1)
	print(ret)



