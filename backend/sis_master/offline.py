# File: offline.py
from pathlib import Path
import numpy as np
from PIL import Image
from feature_extractor import FeatureExtractor

if __name__ == '__main__':
    fe = FeatureExtractor()
    features = []
    img_paths = []

    # Duyệt qua tất cả các thư mục Lxxx trong ./static/img
    for l_dir in sorted(Path("./static/img").glob("L*")):
        # Duyệt qua tất cả các thư mục Vxxx trong mỗi thư mục Lxxx
        for v_dir in sorted(l_dir.glob("V*")):
            # Duyệt qua tất cả các file .webp trong mỗi thư mục Vxxx
            for img_path in sorted(v_dir.glob("*.webp")):
                print(img_path)  # e.g., ./static/img/L001/V001/xxx.webp
                
                # Extract features
                feature = fe.extract(img=Image.open(img_path))
                features.append(feature)
                img_paths.append(str(img_path))

    # Convert to numpy arrays
    features = np.array(features)
    img_paths = np.array(img_paths)

    # Save features and image paths together
    np.savez("features_and_paths_full.npz", features=features, img_paths=img_paths)