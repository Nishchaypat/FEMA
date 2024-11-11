
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text  # Required for BERT preprocessing

class FastBertPredictor:
    def __init__(self, model_path='Best_82'):
        # Load the TensorFlow model
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
        
    def predict(self, text):
        # Convert input to array if it's a single string
        if isinstance(text, str):
            text = np.array([text])
        elif isinstance(text, list):
            text = np.array(text)
            
        # Make prediction
        prediction = self.model.predict(text, verbose=0)
        print(prediction)
        return prediction

# Optionally, include helper functions
def quick_predict(text):
    """
    Fast prediction for a single text
    """
    predictor = FastBertPredictor()
    prediction = predictor.predict(text)
    return "positive" if prediction[0] == 1 else "negative"
