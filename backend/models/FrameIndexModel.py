from models.CSVFileReader import CSVFileReaderModel

class FrameIndexModel:
    def __init__(self):
        self.read_all_csv_files()
        

    def formatFrameId(self, frameID):
        return f'{frameID:06d}'

    def read_all_csv_files(self):
        # Get the list of all .csv files
        csv_files = CSVFileReaderModel.list_csv_files()

        # Dictionary to store file contents
        self.videos = [csv_file[0] for csv_file in csv_files]
        rawContents = [csv_file[1] for csv_file in csv_files]
        self.contents = dict()

        # Loop through each .csv file and read its content
        for index in range(len(rawContents)):
            result = dict()
            content = rawContents[index]

            # self.contents = content
            # break
            for i, record in enumerate(content):
                # Ignore the header
                if i == 0:
                    continue
                
                data = record.split(',')
                if data == '':
                    continue

                if data is not None and len(data) >= 4:
                    result[self.formatFrameId(int(data[0]))] = dict(pts_time = float(data[1]), frame_idx = int(data[3]))

            self.contents[self.videos[index]] = result

        return self.contents

    def extractInfoFromFileName(self, filename: str):
        result = filename.split('\\')
        return result[2], result[3], result[4]
    
    def getKeyByValue(self, myDict: dict, val: str):
        compareVal = val.replace('\\', '/').replace('static/img/', '/data/KeyFrames/')

        for key, frame in myDict.items():
            if compareVal == frame['image_path']:
                return key

        return -1

    def getFrameIdByFileName(self, filename, DictImagePath):
        L_id, V_id, F_id = self.extractInfoFromFileName(filename)

        returnedResult = dict(pts_time = float(-1.0), frame_idx = int(F_id.split('.')[0]), LV_id = str(''), idx = int(self.getKeyByValue(DictImagePath, filename)))
        # DictImagePath = CSVFileReaderModel.load_json_file('dict/id2img_fps.json')
        query_frame = self.formatFrameId(int(F_id.split('.')[0]))

        sub_arr = f'{L_id}_{V_id}.csv'
        if sub_arr in self.contents:
            sub_content = self.contents[sub_arr]
            if query_frame in sub_content:
                returnedResult['pts_time'] = sub_content[query_frame]['pts_time']
                returnedResult['frame_idx'] = sub_content[query_frame]['frame_idx']
                returnedResult['LV_id'] = sub_arr
        
        return returnedResult
        
FrameIndexModelInstance = FrameIndexModel()
