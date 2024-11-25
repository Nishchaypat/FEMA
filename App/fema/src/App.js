import React, { useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale
);

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
    chartColors: {
      backgroundColor: ['rgba(75, 156, 211, 0.6)', 'rgba(243, 156, 18, 0.6)'],
      borderColor: ['rgba(75, 156, 211, 1)', 'rgba(243, 156, 18, 1)'],
    }
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
    chartColors: {
      backgroundColor: ['rgba(129, 140, 248, 0.6)', 'rgba(251, 146, 60, 0.6)'],
      borderColor: ['rgba(129, 140, 248, 1)', 'rgba(251, 146, 60, 1)'],
    }
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

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setBertSentiment(data.bert_sentiment);
      setBertScore(typeof data.bert_score === 'number' ? data.bert_score : data.bert_score[0]);
      setLstmSentiment(data.lstm_sentiment);
      setLstmScore(typeof data.lstm_score === 'number' ? data.lstm_score : data.lstm_score[0]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze sentiment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getColorFromScore = (score) => {
    if (score > 0.65) return 'bg-green-500 text-green-900';
    if (score > 0.35) return 'bg-yellow-500 text-yellow-900';
    return 'bg-red-500 text-red-900';
  };

  // Conditional checks for charts to prevent rendering with null scores
  const barChartData = bertScore !== null && lstmScore !== null ? {
    labels: ['BERT', 'LSTM'],
    datasets: [{
      label: 'Sentiment Score',
      data: [bertScore, lstmScore],
      backgroundColor: theme.chartColors.backgroundColor,
      borderColor: theme.chartColors.borderColor,
      borderWidth: 1,
    }],
  } : null;

  const lineChartData = bertScore !== null && lstmScore !== null ? {
    labels: ['Negative', 'Neutral', 'Positive'],
    datasets: [
      {
        label: 'BERT',
        data: [1 - bertScore, 0.5, bertScore],
        borderColor: theme.chartColors.borderColor[0],
        tension: 0.4,
        fill: false,
      },
      {
        label: 'LSTM',
        data: [1 - lstmScore, 0.5, lstmScore],
        borderColor: theme.chartColors.borderColor[1],
        tension: 0.4,
        fill: false,
      },
    ],
  } : null;

  const radarChartData = bertScore !== null && lstmScore !== null ? {
    labels: ['Positivity', 'Confidence', 'Agreement', 'Objectivity', 'Intensity'],
    datasets: [
      {
        label: 'BERT',
        data: [bertScore, bertScore * 0.9, bertScore * 0.8, bertScore * 0.7, bertScore * 0.85],
        backgroundColor: theme.chartColors.backgroundColor[0],
        borderColor: theme.chartColors.borderColor[0],
      },
      {
        label: 'LSTM',
        data: [lstmScore, lstmScore * 0.9, lstmScore * 0.8, lstmScore * 0.7, lstmScore * 0.85],
        backgroundColor: theme.chartColors.backgroundColor[1],
        borderColor: theme.chartColors.borderColor[1],
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: currentTheme === 'dark' ? '#fff' : '#000',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: currentTheme === 'dark' ? '#fff' : '#000',
        },
        grid: {
          color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: currentTheme === 'dark' ? '#fff' : '#000',
        },
        grid: {
          color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`min-h-screen ${theme.background} p-8`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${theme.text}`}>Sentiment Analyzer</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg text-white`}
          >
            {currentTheme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

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
            disabled={!text.trim() || isLoading}
            className={`w-full py-3 rounded-lg ${theme.primary} text-white transition-all duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 ${theme.highlight} focus:ring-offset-2 ${!text.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>

          {isLoading && (
            <div className="flex justify-center items-center mt-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!isLoading && bertSentiment && lstmSentiment && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-4 ${theme.card} rounded-lg`}>
                <h3 className={`text-lg font-medium ${theme.text} mb-4`}>BERT Sentiment</h3>
                <div className={`text-xl ${getColorFromScore(bertScore)}`}>
                  {bertSentiment} ({(bertScore * 100).toFixed(2)}%)
                </div>
              </div>

              <div className={`p-4 ${theme.card} rounded-lg`}>
                <h3 className={`text-lg font-medium ${theme.text} mb-4`}>LSTM Sentiment</h3>
                <div className={`text-xl ${getColorFromScore(lstmScore)}`}>
                  {lstmSentiment} ({(lstmScore * 100).toFixed(2)}%)
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {barChartData && (
            <div className={`p-4 ${theme.card} rounded-lg`}>
              <h3 className={`text-lg font-medium ${theme.text} mb-4`}>Sentiment Comparison</h3>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          )}

          {lineChartData && (
            <div className={`p-4 ${theme.card} rounded-lg`}>
              <h3 className={`text-lg font-medium ${theme.text} mb-4`}>Sentiment Scores over Time</h3>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
