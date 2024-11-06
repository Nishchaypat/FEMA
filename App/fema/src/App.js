import React, { useState } from 'react';
import { 
  PanelRightOpen, 
  PanelRightClose, 
  Home, 
  Info, 
  Settings,
  Save,
  Trash2,
  Download,
  Share2,
  HelpCircle,
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const analyzeSentiment = async () => {
    try {
      // Simulated API call
      const result = {
        score: 0.8,
        reason: "Positive language and tone",
        keywords: ["great", "excellent", "amazing"],
        emotions: {
          joy: 0.8,
          sadness: 0.1,
          anger: 0.05,
          fear: 0.05
        }
      };
      setSentiment(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const theme = themes[currentTheme];

  const renderAnalyzeTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${theme.text}`}>
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className={`w-full h-48 p-4 rounded-lg border ${theme.input} 
            ${theme.text} text-base transition-all duration-200
            placeholder:text-gray-400 focus:outline-none focus:ring-2 
            ${theme.highlight} focus:border-transparent resize-none`}
        />
      </div>
      
      <button 
        onClick={analyzeSentiment}
        className={`w-full py-3 rounded-lg ${theme.primary} text-white 
          transition-all duration-200 font-medium shadow-sm
          focus:outline-none focus:ring-2 ${theme.highlight} focus:ring-offset-2`}
      >
        Analyze Sentiment
      </button>

      {sentiment && (
        <div className={`mt-6 rounded-lg border ${theme.border} overflow-hidden`}>
          <div className={`px-6 py-4 ${theme.secondaryBg} border-b ${theme.border}`}>
            <h3 className={`text-lg font-medium ${theme.text}`}>Analysis Results</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className={`font-medium ${theme.text}`}>Sentiment Score</span>
              <span className={`${theme.text} bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium`}>
                {sentiment.score}
              </span>
            </div>
            <div className={`${theme.text}`}>
              <span className="font-medium">Key Reason: </span>
              <span>{sentiment.reason}</span>
            </div>
            <div className="mt-4">
              <h4 className={`font-medium ${theme.text} mb-2`}>Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {sentiment.keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h4 className={`font-medium ${theme.text} mb-2`}>Emotional Distribution</h4>
              <div className="space-y-2">
                {Object.entries(sentiment.emotions).map(([emotion, value]) => (
                  <div key={emotion} className="flex items-center gap-2">
                    <span className="w-20 text-sm capitalize">{emotion}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded">
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{(value * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
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
                Sentiment Analyzer
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
          <button
            className="p-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200"
          >
            <HelpCircle size={20} />
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

      {/* Settings Modal */}
      {renderSettings()}

      {/* Drawer Toggle */}
      <button 
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className={`fixed right-4 top-1/2 -translate-y-1/2 p-3 rounded-lg 
          ${theme.primary} text-white shadow-lg transition-all duration-200
          focus:outline-none focus:ring-2 ${theme.highlight} focus:ring-offset-2`}
      >
        {isDrawerOpen ? <PanelRightClose size={24} /> : <PanelRightOpen size={24} />}
      </button>

      {/* Analysis Drawer */}
      <div 
        className={`fixed right-0 top-16 h-[calc(100%-4rem)] w-80 ${theme.card} shadow-2xl 
          transform transition-transform duration-300 ease-in-out border-l ${theme.border}
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${theme.text}`}>Analysis Graphs</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Add download logic here
                  const graphData = {
                    graph1: "Graph 1 data",
                    graph2: "Graph 2 data"
                  };
                  const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sentiment-analysis-graphs.json';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className={`p-2 rounded-lg hover:${theme.secondaryBg} ${theme.text}`}
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => {
                  // Add save logic here
                  localStorage.setItem('savedGraphs', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    graph1: "Graph 1 data",
                    graph2: "Graph 2 data"
                  }));
                }}
                className={`p-2 rounded-lg hover:${theme.secondaryBg} ${theme.text}`}
              >
                <Save size={20} />
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className={`p-2 rounded-lg hover:${theme.secondaryBg} ${theme.text}`}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className={`h-48 ${theme.secondaryBg} rounded-lg shadow-sm 
              flex items-center justify-center ${theme.text}`}>
              Graph 1
            </div>
            <div className={`h-48 ${theme.secondaryBg} rounded-lg shadow-sm 
              flex items-center justify-center ${theme.text}`}>
              Graph 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;