import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const themes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    primary: 'bg-blue-500 hover:bg-blue-600',
    input: 'bg-white border-gray-200',
    text: 'text-gray-900',
    secondaryBg: 'bg-gray-50',
    border: 'border-gray-200',
    highlight: 'ring-blue-500',
    navbar: 'bg-white',
    sidebar: 'bg-white',
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    primary: 'bg-blue-600 hover:bg-blue-700',
    input: 'bg-gray-800 border-gray-700',
    text: 'text-gray-100',
    secondaryBg: 'bg-gray-700',
    border: 'border-gray-700',
    highlight: 'ring-blue-400',
    navbar: 'bg-gray-800',
    sidebar: 'bg-gray-800',
  },
};

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [bertSentiment, setBertSentiment] = useState('');
  const [bertScore, setBertScore] = useState(null);
  const [lstmSentiment, setLstmSentiment] = useState('');
  const [lstmScore, setLstmScore] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);

  const theme = themes[currentTheme];

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading spinner
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      console.log('Response Data:', data);
      setBertSentiment(data.bert_sentiment);
      setBertScore(data.bert_score[0]);
      setLstmSentiment(data.lstm_sentiment);
      setLstmScore(data.lstm_score[0]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Function to determine color based on sentiment score
  const getColorFromScore = (score) => {
    if (score > 0.65) {
      return 'bg-green-500 text-green-900'; // Positive
    } else if (score > 0.35) {
      return 'bg-yellow-500 text-yellow-900'; // Neutral
    } else {
      return 'bg-red-500 text-red-900'; // Negative
    }
  };

  // Chart Data for BERT and LSTM results
  const chartData = {
    labels: ['BERT', 'LSTM'],
    datasets: [
      {
        label: 'Sentiment Score',
        data: [bertScore, lstmScore],
        backgroundColor: ['#4B9CD3', '#F39C12'],
        borderColor: '#4B9CD3',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`min-h-screen ${theme.background} p-8`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className={`text-2xl font-bold ${theme.text}`}>
          Sentiment Analyzer
        </h1>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`block text-sm font-medium ${theme.text}`}>
              Enter your text
            </label>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              className={`w-full h-48 p-4 rounded-lg border ${theme.input} ${theme.text} text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${theme.highlight} focus:border-transparent resize-none`}
            />
          </div>
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-lg ${theme.primary} text-white transition-all duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 ${theme.highlight} focus:ring-offset-2`}
          >
            Analyze Sentiment
          </button>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center mt-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Sentiment Results */}
          {!isLoading && bertSentiment && lstmSentiment && (
            <div className={`mt-6 rounded-lg border ${theme.border} overflow-hidden`}>
              <div
                className={`px-6 py-4 ${theme.secondaryBg} border-b ${theme.border}`}
              >
                <h3 className={`text-lg font-medium ${theme.text}`}>
                  Analysis Results
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* BERT Results */}
                <div>
                  <h4 className={`text-md font-semibold ${theme.text}`}>
                    BERT Analysis
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`font-medium ${theme.text}`}>Sentiment</span>
                    <span
                      className={`${getColorFromScore(bertScore)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {bertSentiment}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`font-medium ${theme.text}`}>
                      Sentiment Score
                    </span>
                    <span
                      className={`${getColorFromScore(bertScore)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {bertScore}
                    </span>
                  </div>
                </div>

                {/* LSTM Results */}
                <div>
                  <h4 className={`text-md font-semibold ${theme.text}`}>
                    LSTM Analysis
                  </h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`font-medium ${theme.text}`}>Sentiment</span>
                    <span
                      className={`${getColorFromScore(lstmScore)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {lstmSentiment}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`font-medium ${theme.text}`}>
                      Sentiment Score
                    </span>
                    <span
                      className={`${getColorFromScore(lstmScore)} px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {lstmScore}
                    </span>
                  </div>
                </div>

                {/* Sentiment Score Bar Chart */}
                <div className="mt-6">
                  <Bar data={chartData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
