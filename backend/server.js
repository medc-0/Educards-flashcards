const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'educards.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create decks table
  db.run(`
    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create flashcards table
  db.run(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      difficulty INTEGER DEFAULT 1,
      last_reviewed DATETIME,
      review_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
    )
  `);

  // Create study sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      deck_id TEXT NOT NULL,
      cards_studied INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE
    )
  `);
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all decks
app.get('/api/decks', (req, res) => {
  db.all('SELECT * FROM decks ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single deck
app.get('/api/decks/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM decks WHERE id = ?', [id], (err, deck) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!deck) {
      res.status(404).json({ error: 'Deck not found' });
      return;
    }
    res.json(deck);
  });
});

// Create new deck
app.post('/api/decks', (req, res) => {
  const { name, description } = req.body;
  const id = uuidv4();
  
  if (!name) {
    res.status(400).json({ error: 'Deck name is required' });
    return;
  }
  
  db.run(
    'INSERT INTO decks (id, name, description) VALUES (?, ?, ?)',
    [id, name, description || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, name, description: description || '' });
    }
  );
});

// Update deck
app.put('/api/decks/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  db.run(
    'UPDATE decks SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Deck not found' });
        return;
      }
      res.json({ id, name, description });
    }
  );
});

// Delete deck
app.delete('/api/decks/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM decks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Deck not found' });
      return;
    }
    res.json({ message: 'Deck deleted successfully' });
  });
});

// Get flashcards for a deck
app.get('/api/decks/:deckId/flashcards', (req, res) => {
  const { deckId } = req.params;
  
  db.all(
    'SELECT * FROM flashcards WHERE deck_id = ? ORDER BY created_at ASC',
    [deckId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Create new flashcard
app.post('/api/decks/:deckId/flashcards', (req, res) => {
  const { deckId } = req.params;
  const { front, back, difficulty } = req.body;
  const id = uuidv4();
  
  if (!front || !back) {
    res.status(400).json({ error: 'Front and back text are required' });
    return;
  }
  
  db.run(
    'INSERT INTO flashcards (id, deck_id, front, back, difficulty) VALUES (?, ?, ?, ?, ?)',
    [id, deckId, front, back, difficulty || 1],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, deck_id: deckId, front, back, difficulty: difficulty || 1 });
    }
  );
});

// Update flashcard
app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const { front, back, difficulty } = req.body;
  
  db.run(
    'UPDATE flashcards SET front = ?, back = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [front, back, difficulty, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Flashcard not found' });
        return;
      }
      res.json({ id, front, back, difficulty });
    }
  );
});

// Delete flashcard
app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM flashcards WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }
    res.json({ message: 'Flashcard deleted successfully' });
  });
});

// Update flashcard review
app.put('/api/flashcards/:id/review', (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.body;
  
  db.run(
    'UPDATE flashcards SET difficulty = ?, last_reviewed = CURRENT_TIMESTAMP, review_count = review_count + 1 WHERE id = ?',
    [difficulty, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Review updated successfully' });
    }
  );
});

// Create study session
app.post('/api/study-sessions', (req, res) => {
  const { deckId } = req.body;
  const id = uuidv4();
  
  db.run(
    'INSERT INTO study_sessions (id, deck_id) VALUES (?, ?)',
    [id, deckId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, deck_id: deckId });
    }
  );
});

// Update study session
app.put('/api/study-sessions/:id', (req, res) => {
  const { id } = req.params;
  const { cardsStudied, correctAnswers, completed } = req.body;
  
  const query = completed 
    ? 'UPDATE study_sessions SET cards_studied = ?, correct_answers = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?'
    : 'UPDATE study_sessions SET cards_studied = ?, correct_answers = ? WHERE id = ?';
  
  const params = completed 
    ? [cardsStudied, correctAnswers, id]
    : [cardsStudied, correctAnswers, id];
  
  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Study session updated successfully' });
  });
});

// Get study statistics
app.get('/api/decks/:deckId/stats', (req, res) => {
  const { deckId } = req.params;
  
  db.get(
    'SELECT COUNT(*) as totalCards FROM flashcards WHERE deck_id = ?',
    [deckId],
    (err, totalCards) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get(
        'SELECT AVG(difficulty) as avgDifficulty, COUNT(*) as reviewedCards FROM flashcards WHERE deck_id = ? AND last_reviewed IS NOT NULL',
        [deckId],
        (err, reviewStats) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          res.json({
            totalCards: totalCards.totalCards,
            reviewedCards: reviewStats.reviewedCards || 0,
            avgDifficulty: reviewStats.avgDifficulty || 0
          });
        }
      );
    }
  );
});

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
