import numpy as np
from configs.myFaiss import TotalIndexList

from utils.FileStream.FileInputStream import VideoDivision, Videoid2imgid 

SearchSpace = dict()

# Lấy danh sách các ảnh liên quan đến các video thuộc id được chỉ định.
def get_search_space(id):
  # id starting from 1 to 4
  search_space = []
  video_space = VideoDivision[f'list_{id}']
  for video_id in video_space:
    search_space.extend(Videoid2imgid[video_id])
  return search_space

for i in range(1, 5):
    SearchSpace[i] = np.array(get_search_space(i)).astype('int64')
SearchSpace[0] = TotalIndexList