# File: feature_extraction.py
import torch
from PIL import Image
import clip
import numpy as np

class FeatureExtractor:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.preprocess = clip.load("ViT-B/32", device=self.device)

    def extract(self, img):
        """
        Extract a deep feature from an input image using CLIP.
        Args:
            img: from PIL.Image.open(path)

        Returns:
            feature (np.ndarray): deep feature with the shape=(512, )
        """
        img = self.preprocess(img).unsqueeze(0).to(self.device)  # Preprocess image
        with torch.no_grad():
            feature = self.model.encode_image(img).cpu().numpy()[0]
        return feature / np.linalg.norm(feature)  # Normalize