# File: server.py
import os
import numpy as np
from PIL import Image
from .feature_extractor import FeatureExtractor
from datetime import datetime
from flask import Flask, request, render_template, jsonify

from models.CSVFileReader import CSVFileReader
app = Flask(__name__)

# Load features and image paths
script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "features_and_paths_full.npz")

data = np.load(file_path)
features = data["features"]
img_paths = data["img_paths"]

fe = FeatureExtractor()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['query_img']

        if file is None:
            return 'File is required!', 400
        # Save query image
        img = Image.open(file.stream)  # PIL image
        uploaded_img_path = "static/uploaded/" + datetime.now().isoformat().replace(":", ".") + "_" + file.filename
        img.save(uploaded_img_path)

        # Run search
        query = fe.extract(img)
        dists = np.linalg.norm(features - query, axis=1)  # L2 distances to features
        ids = np.argsort(dists)[:30]  # Top 30 results

        scores = [(float(dists[id]), str(img_paths[id])) for id in ids]

        

        # <img src="static\img\L01\V001\0003.webp" height="200px">
        # <figcaption>0.299285</figcaption>
    
        frameData = []
        from models.FrameIndexModel import FrameIndexModelInstance
        for i, data in enumerate(scores):
            if i > 30:
                break

            frame = data[1]
            frameResult = FrameIndexModelInstance.getFrameIdByFileName(frame)
            frameData.append(frameResult)

        results = [(float(scores[i][0]), str(scores[i][1]), float(frameData[i]["pts_time"]), int(frameData[i]["frame_idx"])) for i in range(0, len(ids))]
        
        
        # return jsonify(scores, frameData, query_path)
        return render_template('index.html',
                               query_path=uploaded_img_path,
                               results=results,
                               )

        # from models.FrameIndexModel import DictImagePath
        # idx_image = [int(frame['frame_idx']) for frame in frameData]
        # infos_query = list(map(DictImagePath.get, list(idx_image)))
        # image_paths = []
        # for info in infos_query:
        #     if info is not None and info['image_path'] is not None:
        #         image_paths.append(info['image_path'])
        #     else:
        #         image_paths.append(None)

        # return jsonify(scores, idx_image, infos_query, image_paths)


    else:
        return render_template('index.html')

if __name__ == "__main__":
    app.run("0.0.0.0", port=5010)