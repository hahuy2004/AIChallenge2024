import os

class CSVFileReader:
    def __init__(self):
        self.originalPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dict', 'map_keyframes')

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
    
CSVFileReaderModel = CSVFileReader()