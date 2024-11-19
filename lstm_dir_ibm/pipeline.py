import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load the tokenizer and set the sequence length
tokenizer = Tokenizer()  # Ensure this is fitted with the training data vocabulary
max_sequence_length = 100  # Adjust to your model's input length

# Define GloVe Embedding Load Function
def load_glove_embeddings(glove_path='glove.txt'):
    embeddings_index = {}
    with open(glove_path, 'r', encoding='utf8') as f:
        for line in f:
            values = line.split()
            word = values[0]
            coeffs = np.asarray(values[1:], dtype='float32')
            embeddings_index[word] = coeffs
    return embeddings_index

# Create Embedding Matrix
def create_embedding_matrix(tokenizer, embeddings_index, embedding_dim=100):
    word_index = tokenizer.word_index
    embedding_matrix = np.zeros((len(word_index) + 1, embedding_dim))
    for word, i in word_index.items():
        embedding_vector = embeddings_index.get(word)
        if embedding_vector is not None:
            embedding_matrix[i] = embedding_vector
    return embedding_matrix

# Define Preprocessing Pipeline Function
def preprocess_text(text):
    # Tokenize and pad the input text to model's input length
    sequence = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequence, maxlen=max_sequence_length)
    return padded_sequence
