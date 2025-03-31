import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { GAMES_LIST } from './AddResultForm';
import './ResultsChart.css';

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

const ResultsChart: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const availableYears = useMemo(() =>
    [currentYear.toString(), (currentYear - 1).toString()],
    [currentYear]
  );

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  );
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [editingCell, setEditingCell] = useState<{
    gameName: string;
    day: string;
    result: string;
  } | null>(null);

  const fetchResults = useCallback(async () => {
    if (!selectedYear || !currentMonth) return;

    try {
      const monthDocRef = doc(db, 'results', selectedYear, 'data', currentMonth);
      const monthDoc = await getDoc(monthDocRef);

      if (monthDoc.exists()) {
        const data = monthDoc.data() as MonthlyData;
        setMonthlyData(data);
      } else {
        const initialData: MonthlyData = {
          month: currentMonth,
          year: selectedYear,
          games: GAMES_LIST.map(game => ({
            name: game.name,
            time: game.time,
            results: {}
          }))
        };
        setMonthlyData(initialData);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }, [selectedYear, currentMonth]);

  useEffect(() => {
    fetchResults();
  }, [selectedYear, currentMonth, fetchResults]);

  const handleUpdateResult = useCallback(async (
    gameName: string,
    day: string,
    newResult: string
  ) => {
    if (!monthlyData || !selectedYear || !currentMonth) return;

    try {
      const monthDocRef = doc(db, 'results', selectedYear, 'data', currentMonth);
      const updatedGames = monthlyData.games.map(game =>
        game.name === gameName
          ? { ...game, results: { ...game.results, [day]: newResult } }
          : game
      );

      const updateData = {
        games: updatedGames,
        lastUpdated: new Date().toISOString()
      };

      await updateDoc(monthDocRef, updateData);
      setMonthlyData(prev => prev ? { ...prev, games: updatedGames } : null);
      setEditingCell(null);
    } catch (error) {
      console.error("Error updating result:", error);
      alert('Failed to update result. Please try again.');
    }
  }, [monthlyData, selectedYear, currentMonth]);

  const validateResult = useCallback((result: string): boolean => {
    return /^\d{2}$/.test(result);
  }, []);

  const getDaysArray = useCallback(() => {
    if (!selectedYear || !currentMonth) return [];

    const daysInMonth = new Date(
      parseInt(selectedYear),
      new Date(Date.parse(`${currentMonth} 1`)).getMonth() + 1,
      0
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = daysInMonth - i;
      const date = new Date(
        parseInt(selectedYear),
        new Date(Date.parse(`${currentMonth} 1`)).getMonth(),
        day
      );
      return {
        day: day.toString().padStart(2, '0'),
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      };
    });
  }, [selectedYear, currentMonth]);

  return (
    <div className="results-chart">
      <div className="filters">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-select"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={currentMonth} onChange={(e) => setCurrentMonth(e.target.value)}>
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {GAMES_LIST.map(game => (
          <div key={game.name} className="game-row">
            <div className="game-info">
              <div className="game-name">{game.name}</div>
              <div className="game-time">{game.time}</div>
            </div>
            <div className="results-row">
              {getDaysArray().map(({ day, date }) => {
                const result = monthlyData?.games.find(g =>
                  g.name === game.name
                )?.results[day];
                const isEditing = editingCell?.gameName === game.name &&
                  editingCell?.day === day;

                return (
                  <div
                    key={day}
                    className={`result-cell ${result ? 'has-result' : ''} 
                              ${isEditing ? 'editing' : ''}`}
                    onClick={() => !isEditing && setEditingCell({
                      gameName: game.name,
                      day,
                      result: result || ''
                    })}
                  >
                    <div className="date">{date}</div>
                    {isEditing ? (
                      <div className="edit-result">
                        <input
                          type="text"
                          value={editingCell.result}
                          onChange={(e) => setEditingCell({
                            ...editingCell,
                            result: e.target.value
                          })}
                          maxLength={2}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!validateResult(editingCell.result)) {
                                alert('Please enter a valid two-digit number');
                                return;
                              }
                              handleUpdateResult(
                                game.name,
                                day,
                                editingCell.result
                              );
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCell(null);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="result">{result || '-'}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsChart;