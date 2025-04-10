import os
import json

class IgnoreUtilities:
    def __init__(self, backup):
        self.backup = backup
        ignore_dict = None
        if os.path.exists(f"{backup}/answer_ignore.json"):
            with open(f"{backup}/answer_ignore.json", "r") as f:
                ignore_dict = json.load(f)
        else:
            ignore_dict = dict()
            
        self.dict = ignore_dict

    def store_ignore(self):
        with open(f"{self.backup}/answer_ignore.json", "w") as f:
            json.dump(self.dict, f)


    def add_ignore(self, ques_name, ques_idx, autoIgnore):
        if not isinstance(ques_idx, list):
            ques_idx = [ques_idx]
    
        for i in range(len(ques_idx)):
            ques_idx[i] = int(ques_idx[i])

        if not self.dict.get(ques_name, False):
            self.dict[ques_name] = ques_idx
        else:
            for idx in ques_idx:
                if idx not in self.dict[ques_name]:
                    self.dict[ques_name].append(idx)
                elif not autoIgnore:
                    self.dict[ques_name].remove(idx)

        self.store_ignore()

    def clear_ignore(self, ques_name, ques_idx):
        if self.dict.get(ques_name, False):
            if ques_idx in self.dict[ques_name]:
                self.dict[ques_name].remove(ques_idx)
        else:
            print(f"Question name: {ques_name} not exist")

        self.store_ignore()

    def check_ignore(self):
        return list(self.dict.keys())

IgnoreUtilityInstance = IgnoreUtilities('back_up')
AnswerIgnoreDict = IgnoreUtilityInstance.dict