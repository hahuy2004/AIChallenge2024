from configs.dict_init import DictImagePath, KeyframesMapper, AnswerDict, ReorderStatus, UserDict
from utils.status import StatusUtilityInstance
from utils.answer import AnswerUtilityInstance

class IndexUtilities:
    def __init__(self, lst_idxs = dict()):
        self.info = {
            "lst_idxs": lst_idxs,
            "lst_keyframe_idxs": [],
            "lst_keyframe_paths": [],
            "lst_video_idxs": [],
        }

    def index2info(self, lst_idxs):
        self.info = {
            "lst_idxs": lst_idxs,
            "lst_keyframe_idxs": [],
            "lst_keyframe_paths": [],
            "lst_video_idxs": [],
        }

        for idx in lst_idxs:
            image_path = DictImagePath[idx]["image_path"]
            data_part, video_id, frame_id = (
                image_path.replace("/data/KeyFrames/", "").replace(".webp", "").split("/")
            )
            key = f"{data_part}_{video_id}".replace("_extra", "")
            if "extra" not in data_part:
                frame_id = KeyframesMapper[key][str(int(frame_id))]
            frame_id = int(frame_id)

            self.info["lst_keyframe_idxs"].append(frame_id)
            self.info["lst_keyframe_paths"].append(image_path)
            self.info["lst_video_idxs"].append(key)
        return self.info

    def add_submit(self, ques_name, ques_idx):
        ques_idx = int(ques_idx)
        if not AnswerDict.get(ques_name, False):
            AnswerDict[ques_name] = [ques_idx]
        else:
            if ques_idx not in AnswerDict[ques_name]:
                AnswerDict[ques_name].append(ques_idx)
        if not ReorderStatus.get(ques_name, False):
            ReorderStatus[ques_name] = dict(status=False, owner="")
            StatusUtilityInstance.store_status()

        AnswerUtilityInstance.store_answer()

    def clear_submit_helper(self, ques_name, ques_idx):
        if AnswerDict.get(ques_name, False):
            if ques_idx in AnswerDict[ques_name]:
                AnswerDict[ques_name].remove(ques_idx)
        else:
            print(f"Question name: {ques_name} not exist")

        AnswerUtilityInstance.store_answer()

    def check_owned_all(self, username):
        # return all questions after getting checked ownership
        all_ques = sorted(list(AnswerDict.keys()))
        checked_ques = []

        if not UserDict.get(username, False):
            for ques in all_ques:
                checked_ques.append({"question": ques, "owned": False})
            return checked_ques

        # if user exists
        for ques in all_ques:
            if ques in UserDict[username]:
                checked_ques.append({"question": ques, "owned": True})
            else:
                checked_ques.append({"question": ques, "owned": False})

        return checked_ques
    
IndexUtilityInstance = IndexUtilities()