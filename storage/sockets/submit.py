from utils.index import IndexUtilityInstance
from configs.dict_init import AnswerDict
from utils.user import UserUtilityInstance


class SubmitSocket:
    def submit(self, data):
        print("submit")
        ques_name = data["questionName"]
        ques_idx = int(data["idx"])
        user = data["user"]
        IndexUtilityInstance.add_submit(ques_name, ques_idx)
        UserUtilityInstance.add_user(user, ques_name)
        result = {"questionName": ques_name, "data": IndexUtilityInstance.index2info(AnswerDict[ques_name])}
        return result
    
    def clear_submit(self, data):
        print("clear submit")
        ques_name = data["questionName"]
        ques_idx = int(data["idx"])
        IndexUtilityInstance.clear_submit_helper(ques_name, ques_idx)
        result = {"questionName": ques_name, "data": IndexUtilityInstance.index2info(AnswerDict[ques_name])}
        return result
    
    def view_submitted(self, data):
        ques_name = data["questionName"]
        print("view submitted with question name: " + ques_name)
        print("Answer dict: ")
        print(AnswerDict)
        if ques_name is None:
            
            return {"message": "Question name required"}
        result = {}
        if AnswerDict.get(ques_name, False):
            result = {"questionName": ques_name, "data": IndexUtilityInstance.index2info(AnswerDict[ques_name])}

        return result
    
SubmitSocketInstance = SubmitSocket()