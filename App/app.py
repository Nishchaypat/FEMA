#Importing Libraries
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text  #Required for BERT
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
from flask_cors import CORS

#Applying the Pipeline
class FastBertPredictor:
    def __init__(self, model_path=r'/Users/npatel237/Library/CloudStorage/OneDrive-GeorgiaStateUniversity/FEMA/Best_82'):
        print("Loading BERT model...")
        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={'KerasLayer': hub.KerasLayer}
        )
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        print("BERT model loaded successfully.")

    def predict(self, text):
        if isinstance(text, str):
            text = np.array([text])
        elif isinstance(text, list):
            text = np.array(text)
        prediction = self.model.predict(text, verbose=0)
        return prediction

#Other Pipeline with different model and embedding 
class LSTM_BertPredictor:
    def __init__(self, model_path=r'/Users/npatel237/Library/CloudStorage/OneDrive-GeorgiaStateUniversity/FEMA/LSTM_BERT/model'):
        print("Loading BERT model...")
        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={'KerasLayer': hub.KerasLayer}
        )
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        print("BERT model loaded successfully.")

    def predict(self, text):
        if isinstance(text, str):
            text = np.array([text])
        elif isinstance(text, list):
            text = np.array(text)
        prediction = self.model.predict(text, verbose=0)
        return prediction

#Model Initialization

#Initialize BERT predictor
bert_predictor = FastBertPredictor()
lstm_bert = LSTM_BertPredictor()

# Load LSTM components
print("Loading LSTM components...")
lstm_model = load_model('../LSTM/best_lstm_model.h5')
with open('../word_tokenizer_lstm.pkl', 'rb') as handle:
    lstm_tokenizer = pickle.load(handle)
embedding_matrix = np.load('../embedding_matrix_lstm.npy')
max_sequence_length = embedding_matrix.shape[1]
print("LSTM components loaded successfully.")

## Prediction Functions

def quick_bert_predict(text):
    prediction = bert_predictor.predict(text)
    if prediction[0] <= 0.35:
        result = "Negative"
    elif prediction[0] > 0.35 and prediction[0] <= 0.65:
        result = "Neutral"
    else:
        result = "Positive"
    return [prediction, result]

def quick_lstmbert_predict(text):
    prediction = lstm_bert.predict(text)
    if prediction[0] <= 0.35:
        result = "Negative"
    elif prediction[0] > 0.35 and prediction[0] <= 0.65:
        result = "Neutral"
    else:
        result = "Positive"
    return [prediction, result]

def quick_lstm_predict(text):
    sequence = lstm_tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequence, padding='post', maxlen=max_sequence_length)
    prediction = lstm_model.predict(padded_sequence, verbose=0)
    if prediction[0] <= 0.35:
        result = "Negative"
    elif prediction[0] > 0.35 and prediction[0] <= 0.65:
        result = "Neutral"
    else:
        result = "Positive"
    return [prediction, result]

## Flask Application
app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if 'text' not in data:
        return jsonify({"error": "Text is required"}), 400
    
    text = data['text']
    
    # Get predictions from all models
    bert_result = quick_bert_predict(text)
    lstm_result = quick_lstm_predict(text)
    lstm_bert_result = quick_lstmbert_predict(text)
    
    # Serialize the scores
    bert_score = bert_result[0].tolist() if isinstance(bert_result[0], np.ndarray) else bert_result[0]
    lstm_score = lstm_result[0].tolist() if isinstance(lstm_result[0], np.ndarray) else lstm_result[0]
    lstm_bert_score = lstm_bert_result[0].tolist() if isinstance(lstm_bert_result[0], np.ndarray) else lstm_bert_result[0]
    print(bert_score, lstm_score, lstm_bert_score)

    return jsonify({
        "bert_sentiment": bert_result[1],
        "bert_score": bert_score,
        "lstm_sentiment": lstm_result[1],
        "lstm_score": lstm_score,
        "lstm_bert_sentiment": lstm_bert_result[1],
        "lstm_bert_score": lstm_bert_score
    })

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8000)
