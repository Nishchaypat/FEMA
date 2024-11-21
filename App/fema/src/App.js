import React, { useState } from 'react';
import { 
  Home, 
  Info, 
  Settings,
  Palette,
  X
} from 'lucide-react';

const themes = {
  light: {
    background: "bg-gray-50",
    card: "bg-white",
    primary: "bg-blue-500 hover:bg-blue-600",
    input: "bg-white border-gray-200",
    text: "text-gray-900",
    secondaryBg: "bg-gray-50",
    border: "border-gray-200",
    highlight: "ring-blue-500",
    navbar: "bg-white",
    sidebar: "bg-white"
  },
  dark: {
    background: "bg-gray-900",
    card: "bg-gray-800",
    primary: "bg-blue-600 hover:bg-blue-700",
    input: "bg-gray-800 border-gray-700",
    text: "text-gray-100",
    secondaryBg: "bg-gray-700",
    border: "border-gray-700",
    highlight: "ring-blue-400",
    navbar: "bg-gray-800",
    sidebar: "bg-gray-800"
  },
  forest: {
    background: "bg-emerald-50",
    card: "bg-white",
    primary: "bg-emerald-600 hover:bg-emerald-700",
    input: "bg-white border-emerald-200",
    text: "text-gray-900",
    secondaryBg: "bg-emerald-50",
    border: "border-emerald-200",
    highlight: "ring-emerald-500",
    navbar: "bg-white",
    sidebar: "bg-white"
  },
  ocean: {
    background: "bg-sky-50",
    card: "bg-white",
    primary: "bg-sky-600 hover:bg-sky-700",
    input: "bg-white border-sky-200",
    text: "text-gray-900",
    secondaryBg: "bg-sky-50",
    border: "border-sky-200",
    highlight: "ring-sky-500",
    navbar: "bg-white",
    sidebar: "bg-white"
  }
};

const SentimentAnalyzer = () => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('analyze');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(null); // Add state for the score
  const [isLoading, setIsLoading] = useState(false); // State for loading spinners  

  const theme = themes[currentTheme];

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading spinner
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });
  
      const data = await response.json();
      setSentiment(data.sentiment); // Update sentiment state with API result
      setSentimentScore(data.score); // Update sentiment score
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };
  
  const renderAnalyzeTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${theme.text}`}>Enter your text</label>
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
      {sentiment && !isLoading && (
        <div className={`mt-6 rounded-lg border ${theme.border} overflow-hidden`}>
          <div className={`px-6 py-4 ${theme.secondaryBg} border-b ${theme.border}`}>
            <h3 className={`text-lg font-medium ${theme.text}`}>Analysis Results</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className={`font-medium ${theme.text}`}>Sentiment</span>
              <span className={`${theme.text} bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium`}>
                {sentiment}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className={`font-medium ${theme.text}`}>Sentiment Score</span>
              <span className={`${theme.text} bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium`}>
                {sentimentScore}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>About Our Sentiment Analysis Model</h2>
      
      <div className={`${theme.card} rounded-lg border ${theme.border} p-6 space-y-4`}>
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${theme.text}`}>Technology Stack</h3>
          <p className={`${theme.text}`}>
            Our sentiment analysis model leverages state-of-the-art natural language processing technologies:
          </p>
          <ul className={`${theme.text} list-disc pl-6 space-y-2`}>
            <li>LSTM (Long Short-Term Memory) networks for sequential text processing</li>
            <li>BERT (Bidirectional Encoder Representations from Transformers) for contextual understanding</li>
            <li>IBM Watson Natural Language Understanding API for enhanced accuracy</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${theme.text}`}>Development Process</h3>
          <p className={`${theme.text}`}>
            The model underwent extensive training on diverse datasets, including:
          </p>
          <ul className={`${theme.text} list-disc pl-6 space-y-2`}>
            <li>Social media content analysis</li>
            <li>Customer review datasets</li>
            <li>News article sentiment classification</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${theme.text}`}>Capabilities</h3>
          <p className={`${theme.text}`}>
            Our system provides:
          </p>
          <ul className={`${theme.text} list-disc pl-6 space-y-2`}>
            <li>Multi-dimensional emotion analysis</li>
            <li>Contextual sentiment scoring</li>
            <li>Key phrase extraction</li>
            <li>Real-time processing capabilities</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 
      ${isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      transition-opacity duration-300`}>
      <div className={`absolute right-0 top-0 h-full w-80 ${theme.card} shadow-2xl 
        transform transition-transform duration-300 ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${theme.text}`}>Settings</h3>
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className={`p-2 rounded-lg hover:${theme.secondaryBg}`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className={`text-sm font-medium ${theme.text} mb-3`}>
                <div className="flex items-center gap-2">
                  <Palette size={16} />
                  Theme
                </div>
              </h4>
              <div className="space-y-2">
                {Object.keys(themes).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setCurrentTheme(themeName)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium 
                      transition-all duration-200 flex items-center justify-between
                      ${currentTheme === themeName 
                        ? `${themes[themeName].primary} text-white` 
                        : `${theme.secondaryBg} ${theme.text}`}`}
                  >
                    {themeName}
                    {currentTheme === themeName && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-300`}>
      {/* Navbar */}
      <nav className={`${theme.navbar} border-b ${theme.border} fixed w-full z-40`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className={`text-xl font-semibold ${theme.text}`}>
                FEMA Sentiment Analyzer
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full w-16 ${theme.sidebar} border-r ${theme.border} z-30`}>
        <div className="flex flex-col items-center py-4 space-y-6">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`p-3 rounded-lg transition-all duration-200 
              ${activeTab === 'analyze' 
                ? `${theme.primary} text-white` 
                : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`p-3 rounded-lg transition-all duration-200 
              ${activeTab === 'about' 
                ? `${theme.primary} text-white` 
                : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Info size={20} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pl-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className={`${theme.card} rounded-xl shadow-xl p-8 border ${theme.border}`}>
              {activeTab === 'analyze' ? renderAnalyzeTab() : renderAboutSection()}
            </div>
          </div>
        </div>
      </div>
      {renderSettings()}
      
    </div>
  );
};

export default SentimentAnalyzer;