import json
from configs.dict_init import back_up_folder, ReorderStatus


class StatusUtilities:
    def store_status(self):
        with open(f"{back_up_folder}/reorder_status.json", "w") as f:
            json.dump(ReorderStatus, f)


StatusUtilityInstance = StatusUtilities()

