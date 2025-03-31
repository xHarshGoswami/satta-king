import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Header from '../../components/Header/Header';
import './Home.css';
import Chart from '../../components/Chart';
import AdminInfo from '../../components/AdminInfo';
import Navigation from '../../components/Navigation/Navigation';
import waitingGif from '../../assets/homeImages/wait.gif';

// Important games to highlight
const FEATURED_GAMES = [
  'DESAWAR',
  'GALI',
  'GHAZIABAD',
  'FARIDABAD',
  'GURGAON',
  'DELHI SUPER'
];

interface GameData {
  name: string;
  time: string;
  results: {
    [day: string]: string;
  };
}

interface MonthlyData {
  month: string;
  year: string;
  games: GameData[];
  lastUpdated?: string;
}

const renderResult = (result?: string) => {
  if (!result || result === '-' || result === 'Pending' || result === 'XX') {
    return <img src={waitingGif} alt="Waiting" className="waiting-gif" />;
  }
  return result;
};

const Home: React.FC = () => {
  const [featuredResults, setFeaturedResults] = useState<MonthlyData | null>(null);

  const fetchFeaturedResults = async () => {
    try {
      const today = new Date();
      const currentMonth = today.toLocaleString('default', { month: 'long' });
      const currentYear = today.getFullYear().toString();
      const monthDocRef = doc(db, 'results', currentYear, 'data', currentMonth);
      const monthDoc = await getDoc(monthDocRef);

      if (monthDoc.exists()) {
        setFeaturedResults(monthDoc.data() as MonthlyData);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedResults();
    const interval = setInterval(fetchFeaturedResults, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getGameResults = (gameData?: GameData) => {
    if (!gameData?.results) return [];
    return Object.entries(gameData.results)
      .map(([day, result]) => ({ day, result }))
      .sort((a, b) => parseInt(b.day) - parseInt(a.day))
      .slice(0, 2);
  };

  return (
    <div className="home-container">
      <Header />
      <Navigation />
      <main className="home-main">
        <section className="featured-games">
          <h2>टॉप गेम्स</h2>
          <div className="game-grid">
            {FEATURED_GAMES.map((gameName) => {
              const gameData = featuredResults?.games.find(g => g.name === gameName);
              const results = getGameResults(gameData);

              return (
                <div key={gameName} className="game-card">
                  <div className="game-card-header">
                    <h3>{gameName}</h3>
                    <span className="game-time">{gameData?.time || ''}</span>
                  </div>
                  <div className="game-results">
                    <div className="result-row">
                      <span className="result-label">कल का रिजल्ट:</span>
                      <span className="result-value">{renderResult(results[1]?.result)}</span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">आज का रिजल्ट:</span>
                      <span className="result-value">{renderResult(results[0]?.result)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <AdminInfo></AdminInfo>
        <Chart />
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 Satta King. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;