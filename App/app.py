from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text  # Ensure TensorFlow Text is imported as it's needed by the model
from flask_cors import CORS

class FastBertPredictor:
    def __init__(self, model_path=r'C:\Users\admin-npatel237\FEMA\Best_82'):
        # Load the model once during initialization (this happens once when the app starts)
        print("Loading the model...")
        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={'KerasLayer': hub.KerasLayer}
        )
        # Compile the model
        self.model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        print("Model loaded successfully.")

    def predict(self, text):
        # Convert input to array if it's a single string
        if isinstance(text, str):
            text = np.array([text])
        elif isinstance(text, list):
            text = np.array(text)
            
        # Make prediction (don't recompile, just use the already compiled model)
        prediction = self.model.predict(text, verbose=0)  # Set verbose=0 to suppress output
        return prediction

# Initialize predictor once globally (it will persist as long as the app is running)
predictor = FastBertPredictor()

# Flask App setup
app = Flask(__name__)
CORS(app)

# Function to get prediction
def quick_predict(text):
    """
    Fast prediction for a single text
    """
    prediction = predictor.predict(text)
    print(prediction)
    result = "positive" if prediction[0] >= 0.5 else "negative"
    return [prediction, result]

# Define API endpoint for sentiment prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get data from POST request
    data = request.get_json()
    
    # Check if 'text' key is in the request JSON
    if 'text' not in data:
        return jsonify({"error": "Text is required"}), 400
    
    text = data['text']
    
    final_result = quick_predict(text)

    # Ensure the score (final_result[0]) is serializable by converting it to a list if it's a NumPy ndarray
    score = final_result[0].tolist() if isinstance(final_result[0], np.ndarray) else final_result[0]

    # Return prediction as JSON response
    return jsonify({"sentiment": final_result[1], "score": score})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)  # Run on port 5000
