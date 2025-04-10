from flask import jsonify
from configs.myFaiss import CosineFaiss
from utils.FileStream.FileInputStream import KeyframesMapper
from utils.search_utils import group_result_by_video


class FeedbackController:
    # '/feedback'
    def feed_back(self, data):
        k = int(data['k'])
        prev_result = data['videos']
        lst_pos_vote_idxs = data['lst_pos_idxs']
        lst_neg_vote_idxs = data['lst_neg_idxs']
        lst_scores, list_ids, _, list_image_paths = CosineFaiss.reranking(prev_result, lst_pos_vote_idxs, lst_neg_vote_idxs, k)
        data = group_result_by_video(lst_scores, list_ids, list_image_paths, KeyframesMapper)
        return data
    
FeedbackControllerInstance = FeedbackController()