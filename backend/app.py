from flask import Flask, request, jsonify
from flask_cors import CORS

# Run Flask app
app = Flask(__name__, template_folder='templates')
CORS(app)

# app = Flask(__name__, template_folder='templates')
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
from configs.myFaiss import CosineFaiss

@app.route('/translate', methods=['POST'], strict_slashes=False)
def translate():
    data = request.json
    text_query = data['textquery']
    text_query_translated = CosineFaiss.translater(text_query)
    return jsonify(text_query_translated)


# Register blueprint for app routing
from routes.index import index_route
app.register_blueprint(index_route)

'''
Chức năng cụ thể của các hàm được sử dụng:
- CosineFaiss.image_search: Thực hiện tìm kiếm hình ảnh dựa trên embedding cosine similarity.
- CosineFaiss.text_search: Thực hiện tìm kiếm văn bản dựa trên embedding cosine similarity.
- CosineFaiss.context_search: Tìm kiếm dựa trên bối cảnh bao gồm đối tượng, OCR, ASR.
- CosineFaiss.reranking: Xếp hạng lại kết quả tìm kiếm dựa trên phản hồi của người dùng.
- CosineFaiss.translater: Dịch truy vấn văn bản.
- group_result_by_video: Nhóm kết quả tìm kiếm theo video.
- TagRecommendation: Đưa ra gợi ý thẻ từ truy vấn văn bản.
'''

# Running app
if __name__ == '__main__':
    app.run(debug=True, port=8081)