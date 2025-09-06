const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'educards.db');
const db = new sqlite3.Database(dbPath);

console.log('-- Educards Database Viewer');

// View all decks
console.log('-- DECKS:');
db.all('SELECT * FROM decks ORDER BY created_at DESC', (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  
  if (rows.length === 0) {
    console.log('No decks found.');
  } else {
    rows.forEach((deck, index) => {
      console.log(`${index + 1}. ${deck.name}`);
      console.log(`   ID: ${deck.id}`);
      console.log(`   Description: ${deck.description || 'No description'}`);
      console.log(`   Created: ${deck.created_at}`);
      console.log('');
    });
  }
  
  // View all flashcards
  console.log('-- FLASHCARDS:');
  db.all('SELECT f.*, d.name as deck_name FROM flashcards f JOIN decks d ON f.deck_id = d.id ORDER BY f.created_at DESC', (err, cards) => {
    if (err) {
      console.error('Error:', err.message);
      return;
    }
    
    if (cards.length === 0) {
      console.log('No flashcards found.');
    } else {
      cards.forEach((card, index) => {
        console.log(`${index + 1}. [${card.deck_name}] ${card.front.substring(0, 50)}...`);
        console.log(`   ID: ${card.id}`);
        console.log(`   Difficulty: ${card.difficulty}`);
        console.log(`   Reviews: ${card.review_count}`);
        console.log(`   Last Reviewed: ${card.last_reviewed || 'Never'}`);
        console.log('');
      });
    }
    
    // View study sessions
    console.log('-- STUDY SESSIONS:');
    db.all('SELECT s.*, d.name as deck_name FROM study_sessions s JOIN decks d ON s.deck_id = d.id ORDER BY s.started_at DESC', (err, sessions) => {
      if (err) {
        console.error('Error:', err.message);
        return;
      }
      
      if (sessions.length === 0) {
        console.log('No study sessions found.');
      } else {
        sessions.forEach((session, index) => {
          console.log(`${index + 1}. [${session.deck_name}] ${session.cards_studied} cards studied`);
          console.log(`   Correct: ${session.correct_answers}`);
          console.log(`   Started: ${session.started_at}`);
          console.log(`   Completed: ${session.completed_at || 'In progress'}`);
          console.log('');
        });
      }
      
      console.log('-- Database viewer complete!');
      db.close();
    });
  });
});
