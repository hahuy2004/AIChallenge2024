import json
from configs.dict_init import back_up_folder, UserDict


class UserUtilities:
    def store_user(self):
        with open(f"{back_up_folder}/user.json", "w") as f:
            json.dump(UserDict, f)

    def add_user(self, user, ques_name):
        if not UserDict.get(user, False):
            UserDict[user] = [ques_name]
        else:
            if ques_name not in UserDict[user]:
                UserDict[user].append(ques_name)
                UserDict[user] = sorted(UserDict[user])

        self.store_user()


UserUtilityInstance = UserUtilities()
