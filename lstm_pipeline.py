import numpy as np
import json
from tensorflow.keras.models import load_model
from keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os

# Ensure that your tokenizer is available; you might need to load it if it's saved separately
# For demonstration purposes, let's assume the tokenizer is already available in the environment

# Predefined tokenizer; In practice, it should be loaded from a file or the WML environment
word_tokenizer = Tokenizer()

# Load the trained model from the file system (this can be the model uploaded on WML)
def load_model_from_wml(model_path: str):
    """
    Load the model from the saved path or directly from WML if hosted.
    """
    return load_model(model_path)

# Preprocess input text (tokenize and pad it)
def preprocess_input_text(text, maxlen=100):
    """
    Preprocess input text (tokenize and pad it).
    """
    # Tokenize the text using the fitted tokenizer
    tokenized_text = word_tokenizer.texts_to_sequences([text])

    # Pad the sequence to ensure uniform input size (based on the training data)
    padded_text = pad_sequences(tokenized_text, padding='post', maxlen=maxlen)

    return padded_text

# Perform inference with the loaded model
def predict_sentiment(model, text):
    """
    Given an input text, predict its sentiment.
    """
    processed_text = preprocess_input_text(text)
    prediction = model.predict(processed_text)
    
    # Return the prediction as a label
    if prediction >= 0.5:
        return [prediction[0][0], "Positive"]
    else:
        return [prediction[0][0], "Negative"]

# Main function for model inference
def main(input_data):
    """
    Main function to process input text, load the model, and make predictions.
    """
    # Extract the input text from the WML payload (input_data is a list with the text field)
    input_text = input_data['values'][0][0]  # Assuming input_data is a dictionary with 'values' key containing the text data
    
    # Load the trained model (you can replace the model_path with the actual path in the WML environment)
    model_path = "best_lstm_model.h5"  # Path to the model on WML or local path
    model = load_model_from_wml(model_path)
    
    # Predict sentiment for the input text
    result = predict_sentiment(model, input_text)
    
    # Return the result in the format expected by WML
    return {
        "predictions": [
            {
                "label": result[1],  # Sentiment label (Positive or Negative)
                "score": result[0]   # Prediction score
            }
        ]
    }

# Example usage (only for testing locally)
if __name__ == "__main__":
    input_data = {"values": [["This is a great product!"]]}  # Example input in WML format
    result = main(input_data)
    print(f"Predicted Sentiment: {result}")
