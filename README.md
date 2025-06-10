#  SYSTEM AIC2024
---
Team: AIO_WAO
---
# Link demo youtube:
- [Phần 1](https://youtu.be/-odTLpx-_Z4)
- [Phần 2](https://youtu.be/FeJM19mGYEc)

**SOICT 2024** [[`Paper`](https://link.springer.com/chapter/10.1007/978-981-96-4291-5_5)]

## Dataset preparation
Dataset structure:
```
|- dict 
   |- ...
   |- faiss_clip_cosine.bin
   |- faiss_clipv2_cosine.bin
|- frontend
   |- ai
   |   |- public
   |   |   |- data
   |   |   |   |- KeyFrames
   |   |   |   |   |-L01
   |   |   |   |   |-L01_extra
   |   |   |   |   |-....
```
### Dict
- Download full dict zip file: [dict](https://drive.google.com/file/d/1pjArVhbXljkpCLpFGg71rh2yzwXGeJWi/view?usp=sharing)

### Vector embeddings
Download full bin file: 
   - [faiss_clip_cosine.bin](https://drive.google.com/file/d/1_3Z-iR5b3cT-QAfY6u1oUf9__YNju4m1/view?usp=sharing)
   - [faiss_clipv2_cosine.bin](https://drive.google.com/file/d/1CZDLrRlOK7jmvTc-p6jARR4BA6PSA61M/view?usp=sharing)

### Keyframes
Download keyframes zip file and extract to folder frontend/ai/public/data.\
Data part 1:
   - [AIC_KeyframesB1_Reduced](https://www.kaggle.com/datasets/khitrnhxun/aic-keyframesb1-reduced)
   - [AIC_KeyframesB1_Extra_Reduced](https://www.kaggle.com/datasets/khitrnhxun/aic-keyframesb1-extra-reduced)

Data part 2:
   - [AIC_KeyframesB2_Reduced](https://www.kaggle.com/datasets/khitrnhxun/aic-keyframesb2-reduced)
   - [AIC_KeyframesB2_Extra_Reduced](https://www.kaggle.com/datasets/khitrnhxun/aic-keyframesb2-extra-reduced)

Data part 3:
   - [AIC_KeyframesB3_Reduced](https://www.kaggle.com/datasets/khitrnhxun/aic-keyframesb3-reduced)
   - [AIC_KeyframesB2_Extra_Reduced_0](https://www.kaggle.com/code/khitrnhxun/aic-keyframesb3-extra-reduced-notebook-0)
   - [AIC_KeyframesB2_Extra_Reduced_1](https://www.kaggle.com/code/khitrnhxun/aic-keyframesb3-extra-reduced-notebook-1)
   - [AIC_KeyframesB2_Extra_Reduced_2](https://www.kaggle.com/code/khitrnhxun/aic-keyframesb3-extra-reduced-notebook-2)

Data for test: Chứa 5 video của L001 và 5 video của L002
   - [AIC_Keyframe_ForTest](https://drive.google.com/drive/folders/1bfOq0HwP4LThJTWgu0ZhGCmKNt153F7M?usp=drive_link)

## Raw video from AIChallenge 2023
Data part 1:
   - [AIC_VideoB1v1](https://www.kaggle.com/datasets/superheroinmordenday/c00-vidieo)
   - [AIC_VideoB1v2](https://www.kaggle.com/datasets/khitrnhxun/aic-videob1v2)

Data part 2:
   - [AIC_VideoB2](https://www.kaggle.com/datasets/superheroinmordenday/aic-vidieob1v2)

Data part 3:
   - [AIC_VideoB3v1](https://www.kaggle.com/datasets/khitrnhxun/aic-videob3-0)
   - [AIC_VideoB3v2](https://www.kaggle.com/datasets/superheroinmordenday/aic-b2-v3)
   - [AIC_VideoB3v3](https://www.kaggle.com/datasets/nguynlngnamanh/aic-videob3-2)

## Dataset extraction
Detailed on dataset extraction: [data](dataset_extraction/README.md)

## Installation
- ### Tải Anacoda và chạy CMD của Anacoda

- ### Backend
  #### Với local:
   Chạy các dòng sau để khởi tạo môi trường
   ```
   conda create -n AIChallenge2023
   conda activate AIChallenge2023
   pip install git+https://github.com/openai/CLIP.git
   pip install -r requirements.txt
   ```
   Sau đó di chuyển đến 2 file:
   - ...\anaconda3\Lib\site-packages\open_clip\factory.py (Với môi trường Anacoda)
   - ...\Python\Lib\site-packages\open_clip\factory.py (Với local)
   Ở hàm `load_state_dict()` của các file này sửa lại dòng:
   - checkpoint = torch.load(checkpoint_path, map_location=map_location)
   thành
   - checkpoint = torch.load(checkpoint_path, map_location=map_location, weights_only=True)

  #### Với colab:
Chạy file `TestModel_AI` để sử dụng. Lưu ý tạo tài khoản HuggingFace và Ngrok, đồng thời dán đường link dạng "https://d4d1-34-138-87-239.ngrok-free.app" vào link `export const web_url =` của file web_url. Link video demo: [Demo_Colab](https://youtu.be/GZ-Laqjgxiw)
   
- ### Frontend
Install nodejs: https://nodejs.org/en/download
```
npm install
```

- ### DB Sever
```
pip install flask
pip install flask-cors
pip install flask-socketio
pip install pyngrok==4.1.1 (Cái này chưa rõ lắm)
ngrok authtoken your_token # Add your ngrok authentication
```

## Usage
Ở dưới đây là cấu hình cho Windows

- ### Backend
Từ local machine, chạy CMD của môi trường Anacoda được tạo cho AIChallenge2023:
```
conda activate AIChallenge2023
cd E:\AIO-2022 - Copy\Competition\Competition_AIChallenge2023\AIChallenge2023
e:
python app.py
```
Using colaboratory, run appNotebook (App section) for starting the backend.

- ### Frontend
Thay đổi URL trong frontend/ai/src/helper/web_url.js. thành: 
```
//BACKEND
export const web_url = "http://localhost:8080";

//SOCKET | DB SERVER
export const socket_url =
  "http://localhost:5000";

//COMPETITION SUBMISSION SEVER
export const server = "";

//SESSION ID FOR COMPETITION SUBMISSION SEVER
export const session = "";
```
Sau đó tiếp tục sử dụng CMD của môi trường Anacoda tạo cho AIChallenge2023
```
conda activate AIChallenge2023
cd E:\AIO-2022 - Copy\Competition\Competition_AIChallenge2023\AIChallenge2023
e:
npm run dev
```
Nếu chưa chạy được npm run dev thì chạy dòng sau để cài Next.js (Cũng phải cài Node.js nữa):
```
npm install next react react-dom
```

- ### DB Sever
Tiếp tục sử dụng CMD của môi trường Anacoda tạo cho AIChallenge2023:
```
conda activate AIChallenge2023
cd E:\AIO-2022 - Copy\Competition\Competition_AIChallenge2023\AIChallenge2023
e:
python appStorage.py
```
location = {Ho Chi Minh, Vietnam},
series = {SOICT '23}
}
```
