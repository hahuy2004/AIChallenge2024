from flask import Blueprint, request, jsonify
from controllers.index import IndexControllerInstance

index_route = Blueprint('index', __name__)

@index_route.route("/getallques")
def get_all_ques():
    return jsonify(IndexControllerInstance.get_all_ques())

@index_route.route("/getsubmitques", methods=["POST"], strict_slashes=False)
def get_submit_ques():
    return jsonify(IndexControllerInstance.get_submit_ques(request.json["user"]))

@index_route.route("/getquestions", methods=["POST"], strict_slashes=False)
def get_questions():
    return jsonify(IndexControllerInstance.get_questions(request.json["username"]))

@index_route.route("/getignoredquestions", methods=["POST"], strict_slashes=False)
def get_ignored_questions():
    return jsonify(IndexControllerInstance.get_ignored_questions())

@index_route.route("/getignore", methods=["POST"], strict_slashes=False)
def get_ignore():
    return jsonify(IndexControllerInstance.get_ignore(request.json['questionName']))
    
