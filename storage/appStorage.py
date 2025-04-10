# from engineio.async_drivers import gevent
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from flask import Flask

app = Flask(__name__, template_folder="templates")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
# socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

from sockets.ignore import IgnoreSocketInstance
from sockets.submit import SubmitSocketInstance
from sockets.reorder import ReorderSocketInstance

# ================ START SOCKETIO =================
@socketio.on("submit")
def submit(data):
    result = SubmitSocketInstance.submit(data)
    emit("submit", result, broadcast=True)

@socketio.on("clearsubmit")
def clear_submit(data):
    result = SubmitSocketInstance.clear_submit(data)
    emit("clearsubmit", result, broadcast=True)

@socketio.on("ignore")
def ignore(data):
    result = IgnoreSocketInstance.ignore(data)
    emit("ignore", result, broadcast=True)

@socketio.on("clearignore")
def clear_ignore(data):
    result = IgnoreSocketInstance.clear_ignore(data)
    emit("clearignore", result, broadcast=True)

@socketio.on("reorder")
def reorder(data):
    result = ReorderSocketInstance.reorder(data)
    emit("reorder", result, broadcast=True)

@socketio.on("activereorder")
def active_reorder(data):
    status = ReorderSocketInstance.active_reorder(data)
    emit("activereorder", status, broadcast=True)

@socketio.on("viewsubmitted")
def view_submitted(data):
    result = SubmitSocketInstance.view_submitted(data)
    emit("viewsubmitted", result, broadcast=True)
# ================ END SOCKETIO =================

# Register blueprint for app routing
from routes.index import index_route
app.register_blueprint(index_route)

# Running app
if __name__ == "__main__":
    # socketio.run(app)
    socketio.run(app, debug=True)