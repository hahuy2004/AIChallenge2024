from flask import Blueprint, request, jsonify, render_template
from controllers.data import DataControllerInstance
from controllers.search import SearchControllerInstance
from controllers.panel import PanelControllerInstance
from controllers.tag import TagControllerInstance
from controllers.feedback import FeedbackControllerInstance
from controllers.translate import TranslateControllerInstance

index_route = Blueprint('index', __name__)

# Trả về dữ liệu trang chứa các hình ảnh và ID tương ứng từ DictImagePath. 
# Chỉ lấy các ID nhỏ hơn hoặc bằng 500.
@index_route.route('/data')
def index():
    return jsonify(DataControllerInstance.index())

    
# Thực hiện tìm kiếm hình ảnh dựa trên ID của hình ảnh và số lượng kết quả (k). 
# Sử dụng phương pháp tìm kiếm Cosine Faiss để trả về danh sách các điểm số, ID, 
# và đường dẫn hình ảnh tương ứng.
@index_route.route('/imgsearch')
def image_search():
    return jsonify(SearchControllerInstance.image_search(request.args))


# Thực hiện tìm kiếm văn bản dựa trên truy vấn văn bản (textquery) và các tham số khác từ yêu cầu POST.
# Sử dụng các mô hình CLIP và FAISS để tìm kiếm và trả về kết quả dựa trên điểm số và ID.
@index_route.route('/textsearch', methods=['POST'], strict_slashes=False)
def text_search():
    return jsonify(SearchControllerInstance.text_search(request.json))

# Thực hiện tìm kiếm dựa trên nhiều yếu tố khác nhau như đối tượng, 
# OCR (văn bản viết tay), ASR (nhận dạng giọng nói tự động). 
# Kết quả tìm kiếm được trả về dưới dạng danh sách các điểm số và ID hình ảnh tương ứng.
@index_route.route('/panel', methods=['POST'], strict_slashes=False)
def panel():
    return jsonify(PanelControllerInstance.panel(request.json))

# Lấy gợi ý thẻ từ truy vấn văn bản. Trả về danh sách các gợi ý thẻ (tag) dựa trên truy vấn văn bản.
# Người dùng có thể dùng cái này để tăng tính chính xác cho truy vấn (Cái này có vẻ không cần thiết)
@index_route.route('/getrec', methods=['POST'], strict_slashes=False)
def getrec():
    return jsonify(TagControllerInstance.getrec(request.json))

# Lấy thông tin hình ảnh liên quan dựa trên ID của hình ảnh. 
# Trả về URL video, khoảng thời gian của video và các khung hình chính liên quan.
@index_route.route('/relatedimg')
def related_img():
    return jsonify(DataControllerInstance.related_img(request.args))


# Lấy các đoạn video liên quan dựa trên ID của hình ảnh. 
# Trả về thông tin đoạn video, bao gồm các khung hình chính và chỉ số đoạn video đã chọn.
@index_route.route('/getvideoshot')
def get_video_shot():
    return jsonify(DataControllerInstance.get_video_shot(request.args))
    
# Xử lý phản hồi từ người dùng dựa trên các kết quả tìm kiếm trước đó. 
# Thực hiện xếp hạng lại các kết quả dựa trên phản hồi tích cực và tiêu cực.
@index_route.route('/feedback', methods=['POST'], strict_slashes=False)
def feed_back():
    return jsonify(FeedbackControllerInstance.feed_back(request.json))
    

# Dịch truy vấn văn bản sang ngôn ngữ khác. Trả về truy vấn văn bản đã được dịch.
@index_route.route('/translate', methods=['POST'], strict_slashes=False)
def translate():
    return jsonify(TranslateControllerInstance.translate(request.json))


# Tìm kiếm dựa vào hình ảnh nhập từ file local hoặc URL
@index_route.route('/url-img-search', methods=['GET', 'POST'])
def url_image_search():
    if request.method == 'GET':
        return render_template('index.html') 
    
    if 'query_img' not in request.files:
        return "No file part", 400
    file = request.files['query_img']
    if file.filename == '':
        return "No selected file", 400

    data = SearchControllerInstance.url_image_search(request.files['query_img'])
    return jsonify(data)
    # return render_template('index.html', query_path, scores, content)
