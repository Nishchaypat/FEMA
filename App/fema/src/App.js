import React, { useState, useCallback, useMemo } from 'react';
import { ChartBarIcon, ChartLineIcon, SunIcon, MoonIcon, SparklesIcon } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const THEMES = {
  light: {
    background: 'bg-gray-50',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
    },
    card: 'bg-white shadow-sm',
    input: 'bg-white border-gray-200 focus:ring-blue-500',
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    },
    chart: {
      colors: ['#3b82f6', '#10b981', '#f43f5e']
    }
  },
  dark: {
    background: 'bg-gray-900',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-400',
    },
    card: 'bg-gray-800 shadow-md',
    input: 'bg-gray-800 border-gray-700 focus:ring-blue-400',
    button: {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    },
    chart: {
      colors: ['#60a5fa', '#34d399', '#f87171']
    }
  }
};

const SENTIMENT_LABELS = {
  Positive: {
    color: 'text-green-600',
    description: 'The text expresses a positive or optimistic tone.'
  },
  Neutral: {
    color: 'text-yellow-600',
    description: 'The text maintains an objective or balanced tone.'
  },
  Negative: {
    color: 'text-red-600',
    description: 'The text conveys a negative or critical sentiment.'
  }
};

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('summary');
  const [selectedModel, setSelectedModel] = useState('lstm_bert');

  const currentTheme = THEMES[theme];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const analyzeSentiment = useCallback(async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      alert('Failed to analyze sentiment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  const selectedResult = useMemo(() => {
    if (!results) return null;

    switch (selectedModel) {
      case 'bert':
        return {
          sentiment: results.bert_sentiment,
          score: results.bert_score[0]
        };
      case 'lstm':
        return {
          sentiment: results.lstm_sentiment,
          score: results.lstm_score[0]
        };
      case 'lstm_bert':
        return {
          sentiment: results.lstm_bert_sentiment,
          score: results.lstm_bert_score[0]
        };
      default:
        return {
          sentiment: results.lstm_bert_sentiment,
          score: results.lstm_bert_score[0]
        };
    }
  }, [results, selectedModel]);

  const chartData = useMemo(() => {
    if (!results) return null;

    return {
      labels: ['BERT', 'LSTM', 'LSTM-BERT'],
      datasets: [{
        label: 'Sentiment Scores',
        data: [
          results.bert_score[0],
          results.lstm_score[0],
          results.lstm_bert_score[0]
        ],
        backgroundColor: currentTheme.chart.colors,
        borderWidth: 1
      }]
    };
  }, [results, currentTheme]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      }
    }
  };

  const renderView = () => {
    if (!results || !selectedResult) return null;
    const sentimentInfo = SENTIMENT_LABELS[selectedResult.sentiment];

    switch (activeView) {
      case 'summary':
        return (
          <div className={`p-6 ${currentTheme.card} rounded-lg space-y-4`}>
            <div className="flex items-center space-x-3">
              <SparklesIcon className={`w-6 h-6 ${sentimentInfo.color}`} />
              <h3 className={`text-xl font-semibold ${currentTheme.text.primary}`}>
                Sentiment Analysis Result
              </h3>
            </div>
            <div className="space-y-2">
              <p className={`${currentTheme.text.secondary}`}>
                Model: {selectedModel.toUpperCase()}
              </p>
              <div className={`text-2xl font-bold ${sentimentInfo.color}`}>
                {selectedResult.sentiment}
              </div>
              <p className={`${currentTheme.text.secondary}`}>
                {sentimentInfo.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${currentTheme.text.secondary}`}>
                  Score: {selectedResult.score}
                </span>
              </div>
            </div>
            {chartData && (
              <div className="mt-6">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        );

      case 'details':
        return (
          <div className={`p-6 ${currentTheme.card} rounded-lg space-y-4`}>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className={`font-semibold ${currentTheme.text.primary}`}>BERT Model</h4>
                  <p className={`${currentTheme.text.secondary}`}>
                    Sentiment: {results.bert_sentiment}
                  </p>
                  <p className={`${currentTheme.text.secondary}`}>
                    Score: {results.bert_score[0]}
                  </p>
                </div>
                <div>
                  <h4 className={`font-semibold ${currentTheme.text.primary}`}>LSTM Model</h4>
                  <p className={`${currentTheme.text.secondary}`}>
                    Sentiment: {results.lstm_sentiment}
                  </p>
                  <p className={`${currentTheme.text.secondary}`}>
                    Score: {results.lstm_score[0]}
                  </p>
                </div>
                <div>
                  <h4 className={`font-semibold ${currentTheme.text.primary}`}>LSTM-BERT Model</h4>
                  <p className={`${currentTheme.text.secondary}`}>
                    Sentiment: {results.lstm_bert_sentiment}
                  </p>
                  <p className={`${currentTheme.text.secondary}`}>
                    Score: {results.lstm_bert_score[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} p-6 md:p-12 transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className={`text-3xl font-bold ${currentTheme.text.primary}`}>
            Sentiment Analyzer
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${currentTheme.button.secondary}`}
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for sentiment analysis..."
            className={`w-full min-h-[200px] p-4 rounded-lg border focus:outline-none focus:ring-2 ${currentTheme.input} ${currentTheme.text.primary}`}
          />
          <button
            onClick={analyzeSentiment}
            disabled={!text.trim() || isLoading}
            className={`w-full py-3 rounded-lg transition-all ${currentTheme.button.primary} ${!text.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        )}

        {results && !isLoading && (
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              {[
                { view: 'summary', icon: <ChartBarIcon className="w-5 h-5" /> },
                { view: 'details', icon: <ChartLineIcon className="w-5 h-5" /> }
              ].map(({ view, icon }) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`
                    px-4 py-2 rounded-lg flex items-center space-x-2
                    ${activeView === view ? currentTheme.button.primary : currentTheme.button.secondary}
                  `}
                >
                  {icon}
                  <span className="capitalize">{view}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              {['bert', 'lstm', 'lstm_bert'].map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`
                    px-4 py-2 rounded-lg capitalize
                    ${selectedModel === model ? currentTheme.button.primary : currentTheme.button.secondary}
                  `}
                >
                  {model.replace('_', '-')}
                </button>
              ))}
            </div>

            {renderView()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalyzer;