from utils.faiss_processing import MyFaiss
import numpy as np

class MyFaissConfig:
    def __init__(self):
        self.json_path = 'dict/id2img_fps.json'
        self.audio_json_path = 'dict/audio_id2img_id.json'
        self.scene_path = 'dict/scene_id2info.json'
        self.bin_clip_file ='dict/faiss_clip_cosine.bin'
        self.bin_clipv2_file ='dict/faiss_clipv2_ViT_L14_cosine.bin'
        self.video_division_path = 'dict/video_division_tag.json'
        self.img2audio_json_path = 'dict/img_id2audio_id.json'

        self.cosine_faiss = MyFaiss(self.bin_clip_file, self.bin_clipv2_file, self.json_path, self.audio_json_path, self.img2audio_json_path)
    
    def getCosineFaiss(self):
        return self.cosine_faiss
         
    def getTotalListIndex(self):
        return np.array(list(range(len(self.cosine_faiss.id2img_fps)))).astype('int64')

MyFaissInstance = MyFaissConfig()
CosineFaiss = MyFaissInstance.getCosineFaiss()
DictImagePath = CosineFaiss.id2img_fps
TotalIndexList = MyFaissInstance.getTotalListIndex()