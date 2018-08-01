import requests

BASE_URL = "http://localhost:8000"

def video_upload():
    url = BASE_URL + "/api/lambda/pk/upload_movies/"
    files = {"file": open("../test.mp4", "rb")}
    data = {
        "name": "video_name",
	"scene": True,
	"nth": 1
    }
    
    response = requests.post(url, files=files, data=data)
    return response.text

def img_search():
    pass


if __name__ == "__main__":
    ret = video_upload()
    print(ret)
