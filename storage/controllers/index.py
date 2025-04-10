from configs.dict_init import AnswerDict, UserDict
from utils.index import IndexUtilityInstance
from utils.ignore import IgnoreUtilityInstance, AnswerIgnoreDict

class IndexController:
    def get_all_ques(self):
        all_ques = sorted(list(AnswerDict.keys()))
        return all_ques
    
    def get_submit_ques(self, user):
        if UserDict.get(user, False):
            return UserDict[user]
        else:
            return []
        
    def get_questions(self, username):
        checked_ques = IndexUtilityInstance.check_owned_all(username)
        return checked_ques
    
    def get_ignored_questions(self):
        return IgnoreUtilityInstance.check_ignore()
    
    def get_ignore(self, ques_name):
        if AnswerIgnoreDict.get(ques_name, False):
            result = {"questionName": ques_name, "data": AnswerIgnoreDict[ques_name]}
        else:
            result = {"questionName": ques_name, "data": []}
        return result

IndexControllerInstance = IndexController()