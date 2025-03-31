import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { GAMES_LIST } from '../../admin/AddResultForm';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import AdminInfo from '../../components/AdminInfo';
import './CustomChart.css';

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
}

const CustomChart: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [
    new Date().getFullYear().toString(),
    (new Date().getFullYear() - 1).toString()
  ];

  const fetchResults = async () => {
    if (!selectedGame || !selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const monthDocRef = doc(db, 'results', selectedYear, 'data', selectedMonth);
      const monthDoc = await getDoc(monthDocRef);

      if (monthDoc.exists()) {
        setChartData(monthDoc.data() as MonthlyData);
      } else {
        setChartData(null);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to fetch results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGame && selectedMonth && selectedYear) {
      fetchResults();
    }
  }, [selectedGame, selectedMonth, selectedYear]);

  const getDaysInMonth = (month: string, year: string) => {
    const monthIndex = months.indexOf(month);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const getGameResults = () => {
    if (!chartData || !selectedMonth || !selectedYear) return [];

    const game = chartData.games.find(g => g.name === selectedGame);
    if (!game) return [];

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const results = [];

    // Create array for all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      results.push({
        day,
        result: game.results[day] || '-'
      });
    }

    return results.reverse(); // Show latest dates first
  };

  return (
    <div className="custom-chart-container">
      <Header />
      <Navigation />
      <div className="custom-chart">
        <div className="chart-header">
          <h2>Custom Game Chart</h2>
          <div className="instructions-container">
            <div className="instruction-box">
              <h3>How to Check Results:</h3>
              <ol className="instruction-steps">
                <li>Select your game from the dropdown list</li>
                <li>Choose the month you want to check</li>
                <li>Select the year for results</li>
                <li>View all results for the selected month below</li>
              </ol>
            </div>

            <div className="instruction-box hindi">
              <h3>रिजल्ट कैसे देखें:</h3>
              <ol className="instruction-steps">
                <li>ड्रॉपडाउन लिस्ट से अपना गेम चुनें</li>
                <li>जिस महीने का रिजल्ट देखना है वो चुनें</li>
                <li>रिजल्ट के लिए साल चुनें</li>
                <li>चुने गए महीने के सभी रिजल्ट नीचे देखें</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="search-tips">
          <p><strong>💡 Quick Tips:</strong></p>
          <ul>
            <li>🎯 Games are sorted by their play time</li>
            <li>📅 Latest results appear first</li>
            <li>❌ "-" means result is not yet declared</li>
          </ul>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="game-select">Select Game:</label>
            <select
              id="game-select"
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="game-select"
            >
              <option value="">-- Select Game --</option>
              {GAMES_LIST.map(game => (
                <option key={game.name} value={game.name}>
                  {game.name} ({game.time})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month-select">Select Month:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              <option value="">-- Select Month --</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="year-select">Select Year:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {!selectedGame && !loading && (
          <div className="empty-state">
            <p>🎮 Select a game to view its results</p>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="loader"></div>
            <p>Loading results...</p>
          </div>
        ) : (
          <>
            {selectedGame && selectedMonth && (
              <div className="results-header">
                <h3>{selectedGame} - {selectedMonth} {selectedYear}</h3>
              </div>
            )}
            <div className="results-grid">
              {getGameResults().map(({ day, result }) => (
                <div key={day} className="result-card">
                  <div className="result-date">{selectedMonth} {day}</div>
                  <div className="result-value">{result}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <AdminInfo />
    </div>
  );
};

export default CustomChart;