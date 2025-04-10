import json

class FileInputStream():
    def __init__(self, mode = 'r'):
        self.mode = mode

    def loadFile(self, filename):
        with open(filename, self.mode) as f:
            return json.load(f)

FileInput = FileInputStream()

VideoDivision = FileInput.loadFile('dict/video_division_tag.json')
Videoid2imgid = FileInput.loadFile('dict/video_id2img_id.json')
KeyframesMapper = FileInput.loadFile('dict/map_keyframes.json')
Sceneid2info = FileInput.loadFile('dict/scene_id2info.json')