from utils.ignore import IgnoreUtilityInstance, AnswerIgnoreDict
from utils.index import IndexUtilityInstance

class IgnoreSocket():

    def ignore(self, data):
        print("ignore")
        ques_name = data["questionName"]
        ques_idx = data["idx"]
        IgnoreUtilityInstance.add_ignore(ques_name, ques_idx, data["autoIgnore"])
        result = {"questionName": ques_name, "data": AnswerIgnoreDict[ques_name]}
        return result
    
    def clear_ignore(self, data):
        print("clear ignore")
        ques_name = data["questionName"]
        ques_idx = data["idx"]
        IgnoreUtilityInstance.clear_ignore(ques_name, ques_idx)
        result = {"questionName": ques_name, "data": IndexUtilityInstance.index2info(AnswerIgnoreDict[ques_name])}
        return result
    

IgnoreSocketInstance = IgnoreSocket()

    