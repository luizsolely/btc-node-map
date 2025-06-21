import { useEffect, useState } from "react";
import axios from "axios";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLog } from "d3-scale";
import type { HoveredData, ResponseData, CountryNodeInfo } from "../App";
import BtcLogoUrl from '../assets/btc-logo.svg';

interface CustomGeography {
  rsmKey: string;
  id: string;
  properties: {
    name: string;
    iso_a2: string;
  };
}

type WorldMapProps = {
  onCountryHover: (country: HoveredData) => void;
  onDataLoaded: (data: ResponseData) => void;
};

export default function WorldMap({ onCountryHover, onDataLoaded }: WorldMapProps) {
  const [nodesData, setNodesData] = useState<CountryNodeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCountryForTooltip, setHoveredCountryForTooltip] = useState<{ name: string; nodes: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const countryCodeToNumeric: { [key: string]: string } = { 'PR': '630', 'HK': '344', 'HR': '191', 'PT': '620', 'US': '840', 'BR': '076', 'DE': '276', 'JP': '392', 'CA': '124', 'AU': '036', 'FR': '250', 'GB': '826', 'IT': '380', 'CN': '156', 'IN': '356', 'RU': '643', 'ES': '724', 'NL': '528', 'SE': '752', 'NO': '578', 'FI': '246', 'DK': '208', 'CH': '756', 'AT': '040', 'BE': '056', 'PL': '616', 'CZ': '203', 'SK': '703', 'HU': '348', 'RO': '642', 'BG': '100', 'GR': '300', 'TR': '792', 'IL': '376', 'AE': '784', 'SA': '682', 'EG': '818', 'ZA': '710', 'NG': '566', 'KE': '404', 'MX': '484', 'AR': '032', 'CL': '152', 'CO': '170', 'PE': '604', 'VE': '862', 'UY': '858', 'PY': '600', 'BO': '068', 'EC': '218', 'KR': '410', 'TH': '764', 'VN': '704', 'PH': '608', 'MY': '458', 'SG': '702', 'ID': '360', 'NZ': '554', 'ET': '231', 'DJ': '262', 'SO': '706', 'UG': '800', 'RW': '646', 'BA': '070', 'MK': '807', 'RS': '688', 'ME': '499', 'XK': '998', 'TT': '780', 'SS': '728', 'UA': '804' };

  useEffect(() => {
    axios
      .get<ResponseData>("http://localhost:8080/nodesByCountry")
      .then((res) => {
        setNodesData(res.data.countryNodes || []);
        onDataLoaded(res.data);
      })
      .catch((err) => {
        console.error("Erro na API:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [onDataLoaded]);

  const handleMouseMove = (event: React.MouseEvent) => setMousePosition({ x: event.clientX, y: event.clientY });

  if (loading) return <div style={{display: 'flex', gap: 8 ,flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><img src={BtcLogoUrl} alt="Bitcoin Logo"/><p>Loading Map...</p></div>;
  if (error) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Error: {error}</div>;

  const allNodesCount = nodesData.map((c) => c.numberOfNodes);
  const maxNodes = Math.max(...allNodesCount);
  const minNodes = Math.min(...allNodesCount);

  // @ts-ignore
  const colorScale = scaleLog<string>()
    .domain([minNodes <= 0 ? 1 : minNodes, maxNodes])
    .range(["#FEF0E1", "#F7931A"])
    .clamp(true);

  const getCountryNumericCode = (apiCode: string): string | undefined => countryCodeToNumeric[apiCode];

  const handleMouseEnter = (geo: CustomGeography, countryData: CountryNodeInfo | undefined) => {
    const nodes = countryData ? countryData.numberOfNodes : 0;
    const code = countryData ? countryData.countryCode : geo.properties.iso_a2 || geo.id;

    setHoveredCountryForTooltip({ name: geo.properties.name, nodes });
    onCountryHover({ name: geo.properties.name, code: code, nodes: nodes });
  };

  const handleMouseLeave = () => {
    setHoveredCountryForTooltip(null);
    onCountryHover(null);
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Arial, sans-serif', position: 'relative' }} onMouseMove={handleMouseMove}>
      <ComposableMap style={{ width: '100%', height: 'auto', backgroundColor: '#1a1a1a' }} width={1200} height={500} projection="geoMercator" projectionConfig={{ scale: 100, center: [0, 20] }} >
        <Geographies geography="https://unpkg.com/world-atlas@2/countries-50m.json">
          {({ geographies }: { geographies: CustomGeography[] }) =>
            geographies.map((geo) => {
              const countryData = nodesData.find((apiCountry) => getCountryNumericCode(apiCountry.countryCode) === geo.id);
              const numberOfNodes = countryData ? countryData.numberOfNodes : 0;
              let fillColor = "#f0f0f0";
              if (numberOfNodes > 0) {
                fillColor = colorScale(numberOfNodes);
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#333"
                  strokeWidth={0.1}
                  onMouseEnter={() => handleMouseEnter(geo, countryData)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: { outline: "none", transition: "all 0.2s ease" },
                    hover: { opacity: 0.8, outline: "none", stroke: "#000", strokeWidth: 0.5, cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hoveredCountryForTooltip && mousePosition && (
        <div style={{ position: 'fixed', left: mousePosition.x + 15, top: mousePosition.y + 15, background: 'black', color: 'white', padding: '10px', borderRadius: '4px', zIndex: 1000, pointerEvents: 'none' }}>
          <div style={{ fontWeight: 'bold' }}>{hoveredCountryForTooltip.name}</div>
          <div>Nodes: {hoveredCountryForTooltip.nodes}</div>
        </div>
      )}
    </div>
  );
}