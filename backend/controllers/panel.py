import numpy as np
from flask import jsonify

from controllers.search import SearchControllerInstance

from models.SearchSpace import SearchSpace

from configs.myFaiss import CosineFaiss, TotalIndexList

from utils.FileStream.FileInputStream import KeyframesMapper
from utils.context_encoding import VisualEncoder
from utils.search_utils import group_result_by_video
from utils.parse_frontend import parse_data


class PanelController():
    # Auxiliary functions
    def custom_nullish_coalescing_operator(self, operands):
        returned_value = None
        for operand in operands:
            if operand is not None and operand != '':
                returned_value = operand
                break

        return returned_value


    def custom_ternary_conditional_operator(self, condition = False, trueValue = True, falseValue = False):
        if condition == True:
            return trueValue
        else: 
            return falseValue

    def retrieve_panel_items(self, search_items):
        k = int(search_items['k']) #500
        search_space_index = int(search_items['search_space']) #0

        index = self.custom_ternary_conditional_operator(search_items['useid'], #true
            np.array(search_items['id']).astype('int64'), 
            None
        )
        
        # Uncomment this if code doesn't work
        k = min(k, len(index))

        keep_index = None
        if search_items['ignore']:
            ignore_index = SearchControllerInstance.get_related_ignore(np.array(search_items['ignore_idxs']).astype('int64'))
            keep_index = np.delete(TotalIndexList, ignore_index)

        if keep_index is not None:
            if index is not None:
                index = np.intersect1d(index, keep_index)
            else:
                index = keep_index

        if index is None:
            index = SearchSpace[search_space_index]
        else:
            index = np.intersect1d(index, SearchSpace[search_space_index])
        k = min(k, len(index))       

        useid = search_items['useid']
        ocr_input = self.custom_nullish_coalescing_operator([search_items['ocr'], None])
        asr_input = self.custom_nullish_coalescing_operator([search_items['asr'], None])
        return k, index, useid, ocr_input, asr_input


    # '/panel'
    def panel(self, search_items):
        print("panel search")
        k, index, useid, ocr_input, asr_input = self.retrieve_panel_items(search_items)

        # Parse json input
        object_input = parse_data(search_items, VisualEncoder)

        lst_scores, list_ids, _, list_image_paths = CosineFaiss.context_search(
            object_input=object_input, 
            ocr_input=ocr_input, 
            asr_input=asr_input,
            k=k, 
            semantic=False, 
            keyword=True, 
            index=index, 
            useid=useid
        )

        data = group_result_by_video(lst_scores, list_ids, list_image_paths, KeyframesMapper)
        return data


PanelControllerInstance = PanelController()