import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck } from '../context/DeckContext'
import { ArrowLeft, RotateCcw, Check, X, BarChart3, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function StudyMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { flashcards, loading, error, fetchFlashcards, updateFlashcardReview } = useDeck()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyStats, setStudyStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    studied: 0
  })
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    if (id) {
      fetchFlashcards(id)
    }
  }, [id, fetchFlashcards])

  useEffect(() => {
    if (flashcards.length > 0) {
      setStudyStats(prev => ({ ...prev, total: flashcards.length }))
    }
  }, [flashcards])

  const currentCard = flashcards[currentIndex]
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = async (difficulty) => {
    if (!currentCard) return

    const isCorrect = difficulty <= 2 // Easy or Medium = correct
    const newStats = {
      ...studyStats,
      studied: studyStats.studied + 1,
      correct: isCorrect ? studyStats.correct + 1 : studyStats.correct,
      incorrect: isCorrect ? studyStats.incorrect : studyStats.incorrect + 1
    }
    setStudyStats(newStats)

    // Update flashcard review
    try {
      await updateFlashcardReview(currentCard.id, difficulty)
    } catch (error) {
      console.error('Failed to update review:', error)
    }

    // Move to next card or complete study session
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setStudyStats(prev => ({ ...prev, studied: 0, correct: 0, incorrect: 0 }))
    setIsCompleted(false)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'text-green-600 bg-green-100'
      case 2: return 'text-yellow-600 bg-yellow-100'
      case 3: return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Easy'
      case 2: return 'Medium'
      case 3: return 'Hard'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-600 mb-4">No cards to study in this deck</div>
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="btn-primary"
        >
          Add Cards
        </button>
      </div>
    )
  }

  if (isCompleted) {
    const accuracy = studyStats.studied > 0 ? Math.round((studyStats.correct / studyStats.studied) * 100) : 0
    const timeSpent = Math.round((Date.now() - startTime) / 1000 / 60) // minutes

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Study Complete!</h2>
            <p className="text-lg text-gray-600">Excellent work on this study session</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{studyStats.studied}</div>
              <div className="text-sm font-medium text-blue-800">Cards Studied</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
              <div className="text-sm font-medium text-green-800">Accuracy</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{studyStats.correct}</div>
              <div className="text-sm font-medium text-emerald-800">Correct</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{studyStats.incorrect}</div>
              <div className="text-sm font-medium text-orange-800">Incorrect</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 px-8 py-3"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Study Again</span>
            </button>
            <button
              onClick={() => navigate(`/deck/${id}`)}
              className="w-full sm:w-auto btn-secondary px-8 py-3"
            >
              Back to Deck
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/deck/${id}`)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Session</h1>
              <p className="text-gray-600">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{studyStats.correct}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{studyStats.incorrect}</div>
              <div className="text-xs text-gray-500">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((Date.now() - startTime) / 1000 / 60)}m
              </div>
              <div className="text-xs text-gray-500">Time</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-8">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flashcard-inner">
                <div className="flashcard-front bg-gradient-to-br from-primary-50 to-primary-100">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-primary-600 bg-primary-100 mb-6">
                      FRONT
                    </div>
                    <div className="text-xl text-gray-900 leading-relaxed font-medium">
                      {currentCard?.front}
                    </div>
                    <div className="mt-6 text-sm text-gray-500">
                      Click to reveal answer
                    </div>
                  </div>
                </div>
                <div className="flashcard-back bg-gradient-to-br from-green-50 to-green-100">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 mb-6">
                      BACK
                    </div>
                    <div className="text-xl text-gray-900 leading-relaxed font-medium">
                      {currentCard?.back}
                    </div>
                    <div className="mt-6 text-sm text-gray-500">
                      Rate your knowledge below
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Answer Buttons */}
      <div className="text-center">
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How well did you know this?</h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleAnswer(3)}
                  className="flex flex-col items-center space-y-2 px-6 py-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium border border-red-200"
                >
                  <X className="h-6 w-6" />
                  <span>Hard</span>
                </button>
                <button
                  onClick={() => handleAnswer(2)}
                  className="flex flex-col items-center space-y-2 px-6 py-4 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 transition-colors duration-200 font-medium border border-yellow-200"
                >
                  <div className="h-6 w-6 rounded-full bg-yellow-600"></div>
                  <span>Medium</span>
                </button>
                <button
                  onClick={() => handleAnswer(1)}
                  className="flex flex-col items-center space-y-2 px-6 py-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors duration-200 font-medium border border-green-200"
                >
                  <Check className="h-6 w-6" />
                  <span>Easy</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
