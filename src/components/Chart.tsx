import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { GAMES_LIST } from '../admin/AddResultForm';
import waitingGif from '../assets/homeImages/wait.gif';
import './Chart.css';

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

const Chart: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = new Date();
      const currentMonth = today.toLocaleString('default', { month: 'long' });
      const currentYear = today.getFullYear().toString();

      const monthDocRef = doc(db, 'results', currentYear, 'data', currentMonth);
      console.log('Fetching from path:', `results/${currentYear}/data/${currentMonth}`);

      const monthDoc = await getDoc(monthDocRef);

      if (monthDoc.exists()) {
        const data = monthDoc.data() as MonthlyData;
        console.log('Fetched data:', data);
        setMonthlyData(data);
      } else {
        console.log('No data found for:', currentMonth, currentYear);
        setMonthlyData(null);
        setError(`No data available for ${currentMonth} ${currentYear}`);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setMonthlyData(null);
      setError('Failed to load results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getGameResults = (gameData?: GameData) => {
    if (!gameData?.results) return [];

    return Object.entries(gameData.results)
      .map(([day, result]) => ({ day, result }))
      .sort((a, b) => parseInt(b.day) - parseInt(a.day))
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';

    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderResult = (result?: string) => {
    if (!result || result === 'XX') {
      return <img src={waitingGif} alt="Waiting" className="waiting-gif" />;
    }
    return result;
  };

  if (isLoading) {
    return <div className="loading" aria-live="polite">Loading results...</div>;
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Latest Results</h2>
        <p className="last-updated">Last Updated: {formatDate(monthlyData?.lastUpdated)}</p>
        <button
          onClick={fetchResults}
          className="refresh-button"
          disabled={isLoading}
          aria-label="Refresh results"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Results'}
        </button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th className="game-header">Game</th>
                <th className="yesterday-header">कल</th>
                <th className="today-header">आज</th>
              </tr>
            </thead>
            <tbody>
              {GAMES_LIST.map(game => {
                const gameData = monthlyData?.games.find(g => g.name === game.name);
                const results = getGameResults(gameData);

                return (
                  <tr key={game.name}>
                    <td className="game-info">
                      <span className="game-name">{game.name}</span>
                      <span className="game-time">{game.time}</span>
                    </td>
                    <td className="result yesterday">
                      {renderResult(results[1]?.result)}
                    </td>
                    <td className="result today">
                      {renderResult(results[0]?.result)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Chart;