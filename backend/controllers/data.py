
import copy
from flask import jsonify
from configs.myFaiss import DictImagePath
from utils.FileStream.FileInputStream import Sceneid2info, KeyframesMapper


class DataController():
    def __init__(self, MAX_SIZE = 500):
        self.MAX_SIZE = MAX_SIZE

    # '/data'
    def index(self):
        pagefile = []
        for id, value in DictImagePath.items():
            if int(id) > self.MAX_SIZE:
                break
            pagefile.append({'imgpath': value['image_path'], 'id': id})
        data = {'pagefile': pagefile}
        return data
    
    # '/relatedimg'
    def related_img(self, req_args):
        print("related image")
        id_query = int(req_args.get('imgid'))
        image_info = DictImagePath[id_query]
        image_path = image_info['image_path']
        scene_idx = image_info['scene_idx'].split('/')

        video_info = copy.deepcopy(Sceneid2info[scene_idx[0]][scene_idx[1]])
        video_url = video_info['video_metadata']['watch_url']
        video_range = video_info[scene_idx[2]][scene_idx[3]]['shot_time']

        near_keyframes = video_info[scene_idx[2]][scene_idx[3]]['lst_keyframe_paths']
        near_keyframes.remove(image_path)

        data = {'video_url': video_url, 'video_range': video_range, 'near_keyframes': near_keyframes}
        return data
    
    # '/getvideoshot'
    def get_video_shot(self, req_args):
        print("get video shot")

        if req_args.get('imgid') == 'undefined':
            return dict()

        id_query = int(req_args.get('imgid'))
        image_info = DictImagePath[id_query]
        scene_idx = image_info['scene_idx'].split('/')
        shots = copy.deepcopy(Sceneid2info[scene_idx[0]][scene_idx[1]][scene_idx[2]])

        selected_shot = int(scene_idx[3])
        total_n_shots = len(shots)
        new_shots = dict()
        for select_id in range(max(0, selected_shot-5), min(selected_shot+6, total_n_shots)):
            new_shots[str(select_id)] = shots[str(select_id)]
        shots = new_shots

        for shot_key in shots.keys():
            lst_keyframe_idxs = []
            for img_path in shots[shot_key]['lst_keyframe_paths']:
                data_part, video_id, frame_id = img_path.replace('/data/KeyFrames/', '').replace('.webp', '').split('/')
                key = f'{data_part}_{video_id}'.replace('_extra', '')
                if 'extra' not in data_part:
                    frame_id = KeyframesMapper[key][str(int(frame_id))]
                frame_id = int(frame_id)
                lst_keyframe_idxs.append(frame_id)
            shots[shot_key]['lst_idxs'] = shots[shot_key]['lst_keyframe_idxs']
            shots[shot_key]['lst_keyframe_idxs'] = lst_keyframe_idxs

        data = {
            'collection': scene_idx[0],
            'video_id': scene_idx[1],
            'shots': shots,
            'selected_shot': scene_idx[3]
        }

        return data


DataControllerInstance = DataController()