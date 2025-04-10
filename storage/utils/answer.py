import json
from configs.dict_init import back_up_folder, AnswerDict


class AnswerUtilities:
    def store_answer(self):
        with open(f"{back_up_folder}/answer.json", "w") as f:
            json.dump(AnswerDict, f)


AnswerUtilityInstance = AnswerUtilities()

