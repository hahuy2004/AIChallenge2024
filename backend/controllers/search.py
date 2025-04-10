import copy
import numpy as np
from PIL import Image
from datetime import datetime
from pathlib import Path

from configs.myFaiss import CosineFaiss, DictImagePath, TotalIndexList

from models.SearchSpace import SearchSpace
from utils.search_utils import group_result_by_video, group_result_by_video_for_url_img, search_by_filter
from utils.combine_utils import merge_searching_results_by_addition

from utils.FileStream.FileInputStream import KeyframesMapper, Sceneid2info

from sis_master.server import features, img_paths, fe
from models.FrameIndexModel import FrameIndexModelInstance
# from sis_master.feature_extractor import FeatureExtractor
# fe = FeatureExtractor()

class SearchController():
    # Auxiliary functions
    # Lấy danh sách các khung hình gần kề với khung hình có chỉ số idx
    def get_near_frame(self, idx):
        image_info = DictImagePath[idx]
        scene_idx = image_info['scene_idx'].split('/')
        near_keyframes_idx = copy.deepcopy(Sceneid2info[scene_idx[0]][scene_idx[1]][scene_idx[2]][scene_idx[3]]['lst_keyframe_idxs'])
        return near_keyframes_idx

    # Lấy danh sách các khung hình cần bỏ qua dựa trên danh sách các chỉ mục cần bỏ qua ban đầu.
    def get_related_ignore(self, ignore_index):
        total_ignore_index = []
        for idx in ignore_index:
            total_ignore_index.extend(self.get_near_frame(idx))
        return total_ignore_index
    
    # Main methods
    # '/imgsearch'
    def image_search(self, req_args):
        k = int(req_args.get('k'))
        id_query = int(req_args.get('imgid'))
        lst_scores, list_ids, _, list_image_paths = CosineFaiss.image_search(id_query, k=k)

        data = group_result_by_video(lst_scores, list_ids, list_image_paths, KeyframesMapper)
        return data
    
    # '/textsearch'
    def text_search(self, data):
        print("text search")
        print(">>text search data")
        print(data)

        search_space_index = int(data['search_space'])
        print(">> search_space_index", search_space_index)

        k = int(data['k'])
        print(">> k", k)

        clip = data['clip']
        print(">> clip", clip)

        clipv2 = data['clipv2']
        print(">> clipv2", clipv2)

        text_query = data['textquery']
        print(">> text_query", text_query)

        range_filter = int(data['range_filter'])
        print(">> range_filter", range_filter)
        print("index: ", np.array(data['id']).astype('int64'))
        index = None
        if data['filter']:
            index = np.array(data['id']).astype('int64')
            print("type of index", index)
            print("type of index", type(index))
            if index.size > 0:
                k = min(k, index.size)
                print("using index")


        keep_index = None
        ignore_index = None
        if data['ignore']:
            ignore_index = self.get_related_ignore(np.array(data['ignore_idxs']).astype('int64'))
            keep_index = np.delete(TotalIndexList, ignore_index)
            print("using ignore")
        print(">>>>>> kepindex",keep_index)
        print(">>>>>> ignoreindex",ignore_index)
        print(">>>>>> index",index)


        if keep_index is not None:
            if index is not None and index.size > 0:
                index = np.intersect1d(index, keep_index)
            else:
                index = keep_index

        if index is None or index.size == 0:
            index = SearchSpace[search_space_index]
        else:
            index = np.intersect1d(index, SearchSpace[search_space_index])
        k = min(k, index.size)

        if clip and clipv2:
            model_type = 'both'
        elif clip:
            model_type = 'clip'
        else:
            model_type = 'clipv2'

        if data['filtervideo'] != 0:
            print('filter video')
            mode = data['filtervideo']
            prev_result = data['videos']
            data = search_by_filter(prev_result, text_query, k, mode, model_type, range_filter, ignore_index, keep_index, Sceneid2info, DictImagePath, CosineFaiss, KeyframesMapper)
        else:
            if model_type == 'both':
                scores_clip, list_clip_ids, _, _ = CosineFaiss.text_search(text_query, index=index, k=k, model_type='clip')
                scores_clipv2, list_clipv2_ids, _, _ = CosineFaiss.text_search(text_query, index=index, k=k, model_type='clipv2')
                lst_scores, list_ids = merge_searching_results_by_addition([scores_clip, scores_clipv2],
                                                                        [list_clip_ids, list_clipv2_ids])
                infos_query = list(map(CosineFaiss.id2img_fps.get, list(list_ids)))
                list_image_paths = [info['image_path'] for info in infos_query]
            else:
                lst_scores, list_ids, _, list_image_paths = CosineFaiss.text_search(text_query, index=index, k=k, model_type=model_type)
            data = group_result_by_video(lst_scores, list_ids, list_image_paths, KeyframesMapper)
        print(">>>>>data")
        # print(1)
        print(data)
        return data

    # '/url-img-search'
    def url_image_search(self, file):    
        LENGTH = 100
        # Save query image
        img = Image.open(file.stream)  # PIL image

        # Run search
        query = fe.extract(img)
        dists = np.linalg.norm(features - query, axis=1)  # L2 distances to features
        ids = np.argsort(dists)[:LENGTH]  # Top 30 results

        lst_scores = [float(dists[id]) for id in ids]
        list_image_paths = [str(img_paths[id]) for id in ids]

        scores = [(float(dists[id]), str(img_paths[id])) for id in ids]

    
        # <img src="static\img\L01\V001\0003.webp" height="200px">
        # <figcaption>0.299285</figcaption>
    
        frameData = []
        list_idxs = []
        for i, data in enumerate(scores):
            if i > LENGTH:
                break

            frame = data[1]
            frameResult = FrameIndexModelInstance.getFrameIdByFileName(frame, DictImagePath)
            frameData.append(frameResult)
            list_idxs.append(frameResult['idx'])

        # list_idxs = [frame['idx'] for frame in frameData]
        lst_keyframe_idxs = [int(frameData[i]["frame_idx"]) for i in range(0, len(ids))]
        
        # results = [(float(scores[i][0]), str(scores[i][1]), float(frameData[i]["pts_time"]), int(frameData[i]["frame_idx"])) for i in range(0, len(ids))]
        # lst_scores, list_ids, _, list_image_paths = CosineFaiss.image_search(frameData[0]["frame_idx"], k=500)
        # data = group_result_by_video(lst_scores, list_ids, list_image_paths, KeyframesMapper)
        
        data = group_result_by_video_for_url_img(lst_scores, list_idxs, lst_keyframe_idxs, list_image_paths, KeyframesMapper)
        return data
    
    

SearchControllerInstance = SearchController()