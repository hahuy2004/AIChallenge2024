from flask import jsonify
from utils.semantic_embed.tag_retrieval import TagRecommendation

class TagController:
    def getrec(self, text_query):
        print("get tag recommendation")
        k = 50
        print("req>>>>>>>>>>:")
        print(text_query)

        tag_outputs = TagRecommendation(text_query, k)
        print("2")
        return tag_outputs
    

TagControllerInstance = TagController()