from flask import jsonify
from configs.myFaiss import CosineFaiss


class TranslateController:
    def translate(self, data):
        text_query = data['textquery']
        if not text_query:
            return {"error": "textquery is empty"}
        text_query_translated = CosineFaiss.translater(text_query)
        if text_query_translated is None:
            return {"error": "Translation failed"}
        return {"text_query_translated": text_query_translated}
    
TranslateControllerInstance = TranslateController()