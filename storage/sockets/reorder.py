from configs.dict_init import AnswerDict, ReorderStatus
from utils.answer import AnswerUtilityInstance
from utils.index import IndexUtilityInstance


class ReorderSocket:
    def reorder(self, data):
        print("re order")
        ques_name = data["questionName"]
        lst_idxs = data["data"]["lst_idxs"]
        if AnswerDict.get(ques_name, False):
            AnswerDict[ques_name] = lst_idxs
            AnswerUtilityInstance.store_answer()
        
        # Reset status of active_reorder once received reorder
        ReorderStatus[ques_name]["status"] = False
        ReorderStatus[ques_name]["owner"] = ""

        result = {"questionName": ques_name, "data": IndexUtilityInstance.index2info(AnswerDict[ques_name])}
        return result
    
    def active_reorder(data):
        print("active reorder")
        ques_name = data["questionName"]
        user = data["user"]
        is_admin = data["isAdmin"]
        status = {
            "ques_name": ques_name,
            "user": user,
            "is_accepted": False,
        }

        # If is_admin: pass
        if ReorderStatus[ques_name]["status"] and not is_admin:
            print("Reorder an active question error !!!!")
        else:
            ReorderStatus[ques_name]["status"] = True
            ReorderStatus[ques_name]["owner"] = user
            status["is_accepted"] = True
            
        return status

ReorderSocketInstance = ReorderSocket()