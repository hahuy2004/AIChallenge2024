# Importing the libraries that we will use in this notebook.
from deep_translator import GoogleTranslator

class Translation():
    def __init__(self, from_lang='vi', to_lang='en'):
        # Wrapper đơn giản cho thư viện deep-translator
        self.__from_lang = from_lang
        self.__to_lang = to_lang
        self.translator = GoogleTranslator(source=self.__from_lang, target=self.__to_lang)

    def preprocessing(self, text):
        """
        Chuyển văn bản về chữ thường
        """
        return text.lower()

    def __call__(self, text):
        """
        Tiền xử lý và dịch văn bản
        """
        text = self.preprocessing(text)
        return self.translator.translate(text)