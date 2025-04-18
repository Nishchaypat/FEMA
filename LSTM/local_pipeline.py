import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

# Step 1: Load the embedding matrix (optional if you're not retraining)
embedding_matrix = np.loadtxt('../embedding_matrix_lstm.npy', delimiter=',')

# Step 2: Load the trained model
model = load_model('best_lstm_model.h5')

# Step 3: Recreate or load the tokenizer (use the same tokenizer as during training)
with open('../word_tokenizer_lstm.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Step 4: Preprocess the new text
max_sequence_length = embedding_matrix.shape[1]  # Ensure this matches your training config
new_text = "Your input text here"
sequence = tokenizer.texts_to_sequences([new_text])
padded_sequence = pad_sequences(sequence, padding='post', maxlen=max_sequence_length)

# Step 5: Make predictions
prediction = model.predict(padded_sequence)
print("Prediction:", prediction) 
