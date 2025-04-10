import os
import json

class CSVFileReader:
    def __init__(self, outerFolder='dict', innerFolder='map_keyframes'):
        self.originalPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), outerFolder, innerFolder)

    def list_csv_files(self):
        csv_files_with_content = []

        # Loop through each .csv file and read its content
        for filename in os.listdir(self.originalPath):
            if filename.endswith('.csv'):
                content = self.load(filename)
                csv_files_with_content.append((filename, content))

        return csv_files_with_content

    def load(self, filename):
        file_path = os.path.join(self.originalPath, filename)
        
        try:
            with open(file_path, 'r') as file:
                content = file.read().split('\n')
        except FileNotFoundError:
            content = 'File not found.'
        return content
    
    def load_json_file(self, json_path: str):
        with open(json_path, 'r') as f: 
            js = json.load(f)
        return {int(k):v for k,v in js.items()}
    
CSVFileReaderModel = CSVFileReader()

DictImagePath = CSVFileReaderModel.load_json_file('dict/id2img_fps.json')