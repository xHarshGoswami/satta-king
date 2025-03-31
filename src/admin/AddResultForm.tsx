import React, { useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './AddResultForm.css';

// Update the interfaces for better type safety
interface GameResult {
  name: string;
  time: string;
  results: Record<string, string>;  // More precise type for results
}

interface MonthlyData {
  month: string;
  year: string;
  games: GameResult[];
  lastUpdated?: string;
}

interface FormGame {
  name: string;
  result: string;
  editingId: string | null;  // Be explicit about editingId type
}

interface FormData {
  date: string;
  games: FormGame[];  // Use the new FormGame interface
}

interface AddResultFormProps {
  editingId: string | null;
  onSuccess?: () => void;
}

export const GAMES_LIST = [
  { name: 'RAM BAZAR', time: '01:30 AM' },
  { name: 'BIKANER SUPER', time: '02:20 AM' },
  { name: 'DESAWAR', time: '05:00 AM' },
  { name: 'HARI', time: '05:00 AM' },
  { name: 'AFRICA DISAWAR', time: '05:45 AM' }, // Keeping only one entry
  { name: 'HARIOM KADI', time: '07:15 AM' },
  { name: 'NEW PUNJAB', time: '11:10 AM' },
  { name: 'DEVBHOOMI', time: '11:16 AM' },
  { name: 'JAIPUR KING', time: '01:00 PM' },
  { name: 'MEWAT KING', time: '01:30 PM' },
  { name: 'MAYAPURI', time: '01:30 PM' },
  { name: 'SUPER KING', time: '01:45 PM' },
  { name: 'MATKA SONE KA', time: '01:55 PM' },
  { name: 'U.P KING', time: '02:00 PM' },
  { name: 'AGRA BAZAR', time: '02:00 PM' },
  { name: 'RAJDHANI JAIPUR', time: '02:00 PM' },
  { name: 'GALI DISAWAR MIX', time: '02:15 PM' },
  { name: 'DELHI CITY', time: '02:15 PM' },
  { name: 'DELHI DREAM', time: '02:15 PM' },
  { name: 'DELHI GATE', time: '02:20 PM' },
  { name: 'SAVERA', time: '02:30 PM' },
  { name: 'MOHALI', time: '03:00 PM' },
  { name: 'MANGAL BAZAR', time: '03:00 PM' },
  { name: 'KALKA BAZAR', time: '03:00 PM' },
  { name: 'MEERUT METRO', time: '03:00 PM' },
  { name: 'MEERUT CITY', time: '03:00 PM' },
  { name: 'DELHI BAZAR', time: '03:00 PM' },
  { name: 'ROYAL CHALLENGE', time: '03:10 PM' },
  { name: 'TAJ', time: '03:15 PM' },
  { name: 'BADLAPUR', time: '03:20 PM' },
  { name: 'ANARKALI', time: '03:30 PM' },
  { name: 'DELHI DIAMOND', time: '03:30 PM' },
  { name: 'MAA BHAGWATI', time: '03:30 PM' },
  { name: 'CHAND TARA', time: '04:00 PM' },
  { name: 'SHIV SHAKTI', time: '04:05 PM' },
  { name: 'UTTAR PRADESH - UP', time: '04:05 PM' },
  { name: 'FARIDPUR', time: '04:10 PM' },
  { name: 'NEW FARRUKHABAD', time: '04:20 PM' },
  { name: 'JAMUNA PAAR', time: '04:30 PM' },
  { name: 'SHRI GANESH', time: '04:30 PM' },
  { name: 'GHAZIABAD DIN', time: '04:35 PM' },
  { name: 'UTTARAKHAND - UK', time: '05:10 PM' },
  { name: 'DAULAT BAZAR', time: '05:30 PM' },
  { name: 'RAJDHANI', time: '06:00 PM' },
  { name: 'FARIDABAD', time: '06:00 PM' },
  { name: 'GOLD FARIDABAD', time: '07:00 PM' },
  { name: 'AURANGABAD', time: '07:15 PM' },
  { name: 'BIHAR', time: '07:15 PM' },
  { name: 'JAMBO', time: '07:15 PM' },
  { name: 'NEELKANTH', time: '07:20 PM' },
  { name: 'GURGAON', time: '07:30 PM' },
  { name: 'SHRI LAXMI', time: '07:30 PM' },
  { name: 'FARIDA BAZAR', time: '07:40 PM' },
  { name: 'PARAS', time: '07:40 PM' },
  { name: 'DELHI GOLDEN', time: '07:45 PM' },
  { name: 'FARIDABAD KING', time: '07:45 PM' },
  { name: 'OLD FARIDABAD', time: '07:50 PM' },
  { name: 'DHAN KUBER', time: '07:55 PM' },
  { name: 'MAHARAJA', time: '08:00 PM' },
  { name: 'PARIS BAZAR', time: '08:00 PM' },
  { name: 'WHITE GOLD', time: '08:15 PM' },
  { name: 'SAHARANPUR EXPRESS', time: '08:30 PM' },
  { name: 'KOLKATA', time: '08:30 PM' },
  { name: 'DILKASH', time: '09:00 PM' },
  { name: 'GHAZIABAD', time: '09:30 PM' },
  { name: 'DELHI SUPER', time: '10:00 PM' },
  { name: 'GALI', time: '11:30 PM' }
];

const AddResultForm: React.FC<AddResultFormProps> = ({ editingId, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    games: GAMES_LIST.map(game => ({
      name: game.name,
      result: 'XX',
      editingId: null
    }))
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInput = (value: string): boolean => {
    // Allow empty input for typing
    if (value === '') return true;
    // Allow 'XX' as default value
    if (value === 'XX') return true;
    // Check if it's a number and between 0 and 100
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const date = new Date(formData.date);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear().toString();

      // Validate year
      const currentYear = new Date().getFullYear();
      if (parseInt(year) > currentYear) {
        throw new Error('Cannot add results for future years');
      }

      const day = date.getDate().toString().padStart(2, '0');

      // Update the path to match the new structure
      const monthDocRef = doc(db, 'results', year, 'data', month);

      const monthDoc = await getDoc(monthDocRef);
      let monthlyData: MonthlyData;

      if (monthDoc.exists()) {
        const existingData = monthDoc.data() as MonthlyData;
        monthlyData = {
          ...existingData,
          games: existingData.games.map(game => {
            const newResult = formData.games.find(g => g.name === game.name)?.result;
            return {
              ...game,
              results: {
                ...game.results,
                [day]: newResult || 'XX'
              }
            };
          }),
          lastUpdated: new Date().toISOString()
        };
      } else {
        monthlyData = {
          month,
          year,
          games: GAMES_LIST.map(game => ({
            name: game.name,
            time: game.time,
            results: {
              [day]: formData.games.find(g => g.name === game.name)?.result || 'XX'
            }
          }))
        };
      }

      // Log the data being saved for debugging
      console.log('Saving data:', {
        path: `results/${year}/data/${month}`,
        data: monthlyData
      });

      await setDoc(monthDocRef, monthlyData);

      alert('Results added successfully!');

      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        games: GAMES_LIST.map(game => ({
          name: game.name,
          result: 'XX',
          editingId: null
        }))
      });

      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error('Error details:', error);
      // More detailed error message
      if (error instanceof Error) {
        alert(`Error saving results: ${error.message}`);
      } else {
        alert('Error saving results. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add Daily Results</h2>

      <form onSubmit={handleSubmit}>
        <div className="date-input">
          <label>Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="games-grid">
          {formData.games.map((game, index) => (
            <div key={game.name} className="game-input">
              <label>
                {game.name}
              </label>
              <input
                type="text"
                value={game.result === 'XX' ? '' : game.result}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (!validateInput(value)) {
                    return;
                  }
                  const newGames = [...formData.games];
                  newGames[index] = {
                    ...newGames[index],
                    result: value === '' ? 'XX' : value
                  };
                  setFormData({ ...formData, games: newGames });
                }}
                placeholder="XX"
                maxLength={3} // Changed to 3 to allow up to 100
                inputMode="numeric"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Adding Results...' : 'Submit All Results'}
        </button>
      </form>
    </div>
  );
};

export { AddResultForm };
