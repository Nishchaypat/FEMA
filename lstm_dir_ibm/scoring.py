import json
from ibm_watson_machine_learning import APIClient
import pipeline  # Import the pipeline module for preprocessing functions

# Load Model from IBM Watson
def load_model(model_uid):
    # IBM Watson Machine Learning credentials
    wml_credentials = {
        "apikey": "_KnZKtXJvhFYIq2z5Ot08WKKpfBwbsgyj3CWsxYHJyds",
        "url": "https://us-south.ml.cloud.ibm.com"
    }
    
    # Initialize the WML client
    client = APIClient(wml_credentials)
    
    # Retrieve the specific model's details using model_uid
    model_details = client.repository.get_model_details(model_uid)
    print("Model Details:", model_details)
    
    # Load the model
    model = client.repository.load(model_uid)
    return model

# Define Prediction Function
def predict(data, model_uid):
    # Load the model from IBM Watson Machine Learning
    model = load_model(model_uid)
    
    # Preprocess input text using the imported pipeline
    processed_data = pipeline.preprocess_text(data["text"])  # Preprocess before inference
    
    # Predict using the loaded model
    result = model.predict(processed_data)
    return json.dumps({"prediction": result.tolist()})
