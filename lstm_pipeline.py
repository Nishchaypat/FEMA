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
        return [prediction,"Positive"]
    else:
        return [prediction,"Negative"]

# Main function for model inference
def main(input_text: str, model_path: str = 'best_lstm_model.h5'):
    """
    Main function to process input text, load the model, and make predictions.
    """
    # Load the trained model
    model = load_model_from_wml(model_path)
    
    # Predict sentiment for the input text
    result = predict_sentiment(model, input_text)
    
    # Return the result
    return result

# Example usage
if __name__ == "__main__":
    input_text = "This is a great product!"
    model_path = "best_lstm_model.h5"  # Path to the uploaded model on IBM Cloud
    result = main(input_text, model_path)
    print(f"Predicted Sentiment: {result}")
