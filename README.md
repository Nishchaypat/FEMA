# Sentiment Analysis of Twitter Data
## FEMA Research Report

### Abstract
Understanding customer sentiment is crucial for businesses and organizations to make informed decisions. Sentiment analysis, particularly using data from social media platforms like Twitter, offers valuable insights. This study evaluates multiple machine learning and deep learning algorithms for sentiment classification, demonstrating that while Long Short-Term Memory (LSTM) and Bidirectional Encoder Representations from Transformers (BERT) are highly effective, traditional models such as Logistic Regression and Support Vector Machine (SVM) can also be employed under specific constraints.

### I. Introduction
Social media platforms, particularly Twitter, provide a rich source of real-time public opinion and sentiment. This study aims to:
- Evaluate the performance of traditional machine learning models in sentiment classification
- Assess the effectiveness of deep learning approaches
- Compare the strengths and limitations of different sentiment analysis techniques

### II. Methodology

#### A. Data Collection
- **Dataset**: Sentiment140 Dataset
  - 1.6 million tweets
  - Sentiment labels: 0 (Negative) and 4 (Positive)
  - Normalized to 0-1 range for model training

#### B. Preprocessing
1. **Feature Selection**
   - Dropped non-essential features (ids, date, flag, user)
   - Focused on tweet content

2. **Text Embedding**
   - Converted text to embeddings using:
     - spaCy
     - Pre-trained GloVe embeddings
     - BERT

### III. Model Implementations

#### A. Traditional Machine Learning Models
1. **Logistic Regression**
   - Accuracy: 74.0%
   - Best Parameters: C=1, penalty='l2', solver='sag'
   - Precision: 0.74 (Class 0), 0.73 (Class 1)

2. **Gaussian Naive Bayes**
   - Accuracy: 72.1%
   - Best Parameter: var_smoothing=0.335981
   - Precision: 0.73 (Class 0), 0.71 (Class 1)

3. **Support Vector Machines**
   - Accuracy: 74.5%
   - Best Parameters: C=20, gamma=0.1
   - Precision: 0.76 (Class 0), 0.73 (Class 1)

4. **K-Nearest Neighbors**
   - Accuracy: 73.2%
   - Best Parameters: n_neighbors=7, weights='distance'
   - Precision: 0.74 (Class 0), 0.72 (Class 1)

#### B. Deep Learning Models
1. **Long Short-Term Memory (LSTM)**
   - Accuracy: 80.77%
   - Key Parameters:
     - LSTM Units: 192
     - Dropout: 0.5
     - Learning Rate: 0.001

2. **BERT (Bidirectional Encoder Representations)**
   - Accuracy: 82.7% (after tuning)
   - Embedding Dimension: 768
   - Model Architecture: 128 → 64 → 32 → 16 → 1

### IV. Results and Discussion
- BERT achieved the highest accuracy of 82.7%
- LSTM showed significant improvement over traditional models
- Traditional models struggled with nuanced sentiment interpretation

### V. Limitations
1. **Traditional Models**
   - Inability to capture contextual relationships
   - Linear decision boundary constraints
   - Assumption of feature independence

2. **Deep Learning Models**
   - Higher computational complexity
   - Require substantial training data
   - More intricate implementation

### VI. Conclusion
Deep learning models, especially transformer-based architectures like BERT, are more suitable for sentiment analysis due to their ability to:
- Capture contextual relationships
- Understand word order and sequence
- Process text bidirectionally

### VII. Future Work
- Explore advanced transformer architectures
- Investigate domain-specific fine-tuning techniques
- Develop more efficient computational approaches

### References
[1] J. Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," in Proc. NAACL, 2019.

[2] "Comparative Analysis of Sentiment Analysis Models," Journal of Big Data, Springer, 2023.

[3] A. Go, R. Bhayani, and L. Huang, "Twitter Sentiment Classification using Distant Supervision," Stanford University, 2020.

### Dataset
Available at: https://www.kaggle.com/datasets/kazanova/sentiment140

### Acknowledgments
This research was conducted as part of the FEMA Sentiment Analysis project.

# DEMO:

## Positive Tweets
Below are examples of positive tweets, presented with their respective comparisons:

### Tweet 1
  ![Positive Tweet 1 (Left)](https://github.com/user-attachments/assets/88219050-4c0f-47fe-8600-eca46d854e23)  
  ![Positive Tweet 1 (Right)](https://github.com/user-attachments/assets/706efdfc-bba6-4f75-a28a-9daaa2614894)  

### Tweet 2
  ![Positive Tweet 2 (Left)](https://github.com/user-attachments/assets/5f00d072-578d-432f-8568-b8c049743bad)  
  ![Positive Tweet 2 (Right)](https://github.com/user-attachments/assets/c009d1c6-db16-4673-be6d-a5fef5003a28)  
