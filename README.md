# Educards - Smart Flashcards Web App

A modern, responsive flashcard application built with React, Tailwind CSS v3, and SQLite backend. Perfect for effective learning and studying.

## Features

- 🎯 **Smart Study Mode** - Interactive flashcard studying with progress tracking
- 📚 **Deck Management** - Create, organize, and manage multiple flashcard decks
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly** - Optimized for all device sizes
- 🚀 **Fast & Lightweight** - Built with Vite for optimal performance
- 💾 **SQLite Database** - Reliable local data storage
- 📊 **Study Statistics** - Track your learning progress

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS v3
- React Router
- Framer Motion
- Lucide React Icons

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- UUID

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Educards
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3000

3. **Open your browser**
   Navigate to http://localhost:3000 to use the application

## Usage

### Creating Your First Deck
1. Click "Create Deck" on the home page
2. Enter a name and optional description
3. Click "Create Deck"

### Adding Flashcards
1. Open a deck by clicking on it
2. Click "Add Card" to create new flashcards
3. Enter the front (question) and back (answer) text
4. Set the difficulty level (Easy, Medium, Hard)
5. Click "Create Card"

### Studying
1. Click the "Study" button on any deck with cards
2. Click cards to flip them and reveal answers
3. Rate your knowledge: Easy, Medium, or Hard
4. Track your progress and accuracy

## Project Structure

```
Educards/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
└── README.md
```

## API Endpoints

### Decks
- `GET /api/decks` - Get all decks
- `POST /api/decks` - Create new deck
- `GET /api/decks/:id` - Get single deck
- `PUT /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck

### Flashcards
- `GET /api/decks/:deckId/flashcards` - Get deck flashcards
- `POST /api/decks/:deckId/flashcards` - Create flashcard
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Delete flashcard
- `PUT /api/flashcards/:id/review` - Update review stats

## Building for Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd backend
   npm start
   ```

## Future Enhancements

- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Spaced repetition algorithm
- [ ] Import/export functionality
- [ ] Desktop app with Electron
- [ ] Mobile app with React Native

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ for effective learning
