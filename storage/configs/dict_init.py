import os
import json

back_up_folder = "back_up"

DictImagePath = None
with open("dict/id2img_fps.json", "r") as f:
    DictImagePath = json.load(f)
    DictImagePath = {int(k): v for k, v in DictImagePath.items()}

KeyframesMapper = None
with open("dict/map_keyframes.json", "r") as f:
    KeyframesMapper = json.load(f)

AnswerDict = None
if os.path.exists(f"{back_up_folder}/answer.json"):
    with open(f"{back_up_folder}/answer.json", "r") as f:
        AnswerDict = json.load(f)
else:
    AnswerDict = dict()

UserDict = None
if os.path.exists(f"{back_up_folder}/user.json"):
    with open(f"{back_up_folder}/user.json", "r") as f:
        UserDict = json.load(f)
else:
    UserDict = dict()

ReorderStatus = None
if os.path.exists(f"{back_up_folder}/reorder_status.json"):
    with open(f"{back_up_folder}/reorder_status.json", "r") as f:
        ReorderStatus = json.load(f)
else:
    ReorderStatus = dict()