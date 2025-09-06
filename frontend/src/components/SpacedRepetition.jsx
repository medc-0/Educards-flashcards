import React, { useState, useEffect } from 'react'
import { useDeck } from '../context/DeckContext'
import { Clock, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function SpacedRepetition() {
  const { flashcards, updateFlashcardReview } = useDeck()
  const [dueCards, setDueCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    correct: 0,
    incorrect: 0
  })

  // Spaced repetition intervals (in days)
  const intervals = [1, 3, 7, 14, 30, 90]

  useEffect(() => {
    const now = new Date()
    const due = flashcards.filter(card => {
      if (!card.last_reviewed) return true // Never reviewed
      
      const lastReview = new Date(card.last_reviewed)
      const daysSinceReview = Math.floor((now - lastReview) / (1000 * 60 * 60 * 24))
      const interval = intervals[card.difficulty - 1] || 1
      
      return daysSinceReview >= interval
    })
    
    setDueCards(due)
  }, [flashcards])

  const currentCard = dueCards[currentCardIndex]

  const handleAnswer = async (difficulty) => {
    if (!currentCard) return

    const isCorrect = difficulty <= 2
    const newStats = {
      ...sessionStats,
      studied: sessionStats.studied + 1,
      correct: isCorrect ? sessionStats.correct + 1 : sessionStats.correct,
      incorrect: isCorrect ? sessionStats.incorrect : sessionStats.incorrect + 1
    }
    setSessionStats(newStats)

    // Update card with new difficulty and review time
    try {
      await updateFlashcardReview(currentCard.id, difficulty)
    } catch (error) {
      console.error('Failed to update review:', error)
    }

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      // Session complete
      setCurrentCardIndex(0)
      setIsFlipped(false)
    }
  }

  const getNextReviewDate = (difficulty) => {
    const interval = intervals[difficulty - 1] || 1
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + interval)
    return nextDate.toLocaleDateString()
  }

  if (dueCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Caught Up!</h2>
          <p className="text-gray-600 mb-6">
            No cards are due for review right now. Great job staying on top of your studies!
          </p>
          <div className="text-sm text-gray-500">
            Next review session will be available when cards are due.
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Spaced Repetition</h1>
          <p className="text-gray-600">
            Review cards based on scientific learning intervals
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{dueCards.length}</div>
          <div className="text-sm text-gray-600">Cards Due</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{sessionStats.studied}</div>
          <div className="text-sm text-gray-600">Studied Today</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{sessionStats.correct}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {sessionStats.studied > 0 ? Math.round((sessionStats.correct / sessionStats.studied) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <motion.div
          key={currentCardIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Card {currentCardIndex + 1} of {dueCards.length}
              </span>
              <span className="text-sm text-gray-500">
                Due: {currentCard?.last_reviewed ? 
                  new Date(currentCard.last_reviewed).toLocaleDateString() : 
                  'Never reviewed'
                }
              </span>
            </div>
            
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
              <div className="flashcard-inner">
                <div className="flashcard-front bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
                  <div className="text-center">
                    <div className="text-sm font-medium text-primary-600 mb-4">FRONT</div>
                    <div className="text-lg text-gray-900 leading-relaxed">
                      {currentCard?.front}
                    </div>
                  </div>
                </div>
                <div className="flashcard-back bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600 mb-4">BACK</div>
                    <div className="text-lg text-gray-900 leading-relaxed">
                      {currentCard?.back}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600 mb-4">
                {isFlipped ? 'How well did you know this?' : 'Click the card to reveal the answer'}
              </p>
              
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-3"
                >
                  <button
                    onClick={() => handleAnswer(3)}
                    className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                  >
                    Hard
                  </button>
                  <button
                    onClick={() => handleAnswer(2)}
                    className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200 font-medium"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleAnswer(1)}
                    className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                  >
                    Easy
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spaced Repetition Schedule</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {intervals.map((interval, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{interval} day{interval !== 1 ? 's' : ''}</div>
              <div className="text-sm text-gray-600">Difficulty {index + 1}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Cards are scheduled for review based on how well you know them
        </p>
      </div>
    </div>
  )
}
