// Simple hash function for deterministic randomization
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get today's date string for consistent daily challenges
function getTodayString(): string {
  return new Date().toDateString();
}

// Generate daily color based on date
export function getDailyColor(): string {
  const today = getTodayString();
  const hash = simpleHash(`color_${today}`);
  
  // Generate RGB values
  const r = (hash % 200) + 55; // 55-255
  const g = ((hash >> 8) % 200) + 55;
  const b = ((hash >> 16) % 200) + 55;
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate daily music sequence (3-4 notes)
export function getDailyMusicSequence(): number[] {
  const today = getTodayString();
  const hash = simpleHash(`music_${today}`);
  
  const length = 6 + (hash % 3); // 6, 7 or 8 notes
  const sequence: number[] = [];
  
  for (let i = 0; i < length; i++) {
    const noteHash = simpleHash(`music_${today}_${i}`);
    sequence.push(noteHash % 10); // 10 available notes (0-9)
  }
  
  return sequence;
}

// Generate daily word sequence for Stroop test
export function getDailyWordSequence(): Array<{wordColorIndex: number, textColorIndex: number}> {
  const today = getTodayString();
  const hash = simpleHash(`word_${today}`);
  
  const length = 3 + (hash % 3); // 3-5 words
  const sequence: Array<{wordColorIndex: number, textColorIndex: number}> = [];
  
  for (let i = 0; i < length; i++) {
    const wordHash = simpleHash(`word_${today}_${i}`);
    const textHash = simpleHash(`text_${today}_${i}`);
    
    let wordColorIndex = wordHash % 7;
    let textColorIndex = textHash % 7;
    
    // Ensure word color and text color are different
    while (wordColorIndex === textColorIndex) {
      textColorIndex = (textColorIndex + 1) % 7;
    }
    
    sequence.push({ wordColorIndex, textColorIndex });
  }
  
  return sequence;
}

// Check if user has played a game today
export function hasPlayedToday(gameType: string): boolean {
  const today = getTodayString();
  const gameKey = `game_${gameType}_${today}`;
  return localStorage.getItem(gameKey) !== null;
}

// Save game result
export function saveGameResult(gameType: string, success: boolean): void {
  const today = getTodayString();
  const gameKey = `game_${gameType}_${today}`;
  const result = {
    date: today,
    success,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(gameKey, JSON.stringify(result));
}

// Get game result for today
export function getTodayResult(gameType: string): {success: boolean, timestamp: string} | null {
  const today = getTodayString();
  const gameKey = `game_${gameType}_${today}`;
  const result = localStorage.getItem(gameKey);
  
  if (!result) return null;
  
  try {
    return JSON.parse(result);
  } catch {
    return null;
  }
}