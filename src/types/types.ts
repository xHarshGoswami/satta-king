interface Game {
  name: string;
  time: string;
}

interface GameResult {
  name: string;
  result: string;
  editingId: string | null;
}

interface FormData {
  date: string;
  games: GameResult[];
}