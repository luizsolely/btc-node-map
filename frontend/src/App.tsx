import { useState, useCallback } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';
import BtcLogoUrl from './assets/btc-logo.svg';

export type CountryNodeInfo = {
  countryCode: string;
  numberOfNodes: number;
};

export type ResponseData = {
  timestamp: string;
  responseStatus: number;
  countryNodes: CountryNodeInfo[];
};

export type HoveredData = {
  name: string;
  code: string;
  nodes: number;
} | null;

function App() {
  const [hoveredData, setHoveredData] = useState<HoveredData>(null);
  
  const [summaryData, setSummaryData] = useState<{ totalNodes: number; timestamp: string | null }>({
    totalNodes: 0,
    timestamp: null,
  });

  const handleCountryHover = (data: HoveredData) => {
    setHoveredData(data);
  };

  const handleDataLoaded = useCallback((data: ResponseData) => {
    const total = data.countryNodes.reduce((sum, country) => sum + country.numberOfNodes, 0);
    const formattedTimestamp = new Date(data.timestamp).toLocaleString('pt-BR');
    setSummaryData({ totalNodes: total, timestamp: formattedTimestamp });
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={BtcLogoUrl} className='navbar-img' alt="Bitcoin Logo" />
          <p><span>BTC </span> Node Map</p>
          
          {summaryData.totalNodes > 0 && (
            <div className="navbar-summary-item">
              <p>Total Nodes: <span className="info-value">{summaryData.totalNodes.toLocaleString('en-US')}</span></p>
            </div>
          )}
        </div>

        <div className="navbar-right">
           {summaryData.timestamp && (
            <div className="navbar-summary-item">
              <p>Updated At: <span className="info-value">{summaryData.timestamp}</span></p>
            </div>
          )}

          {hoveredData ? (
            <div className="navbar-info">
              <p>Country Code: <span className="info-value">{hoveredData.code}</span></p>
              <p>Total Nodes: <span className="info-value">{hoveredData.nodes.toLocaleString('en-US')}</span></p>
            </div>
          ) : (
            <div className="navbar-info-placeholder">
              <p>Hover over a country for details</p>
            </div>
          )}
          <a href="https://github.com/luizsolely" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </div>
      </nav>
      <div className="map-container">
        <WorldMap
          onCountryHover={handleCountryHover}
          onDataLoaded={handleDataLoaded}
        />
      </div>
    </>
  );
}

export default App;