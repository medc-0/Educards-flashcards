import React, { useState } from 'react'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

export function Flashcard({ card, onEdit, onDelete, isDeleting }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleReset = () => {
    setIsFlipped(false)
  }

  return (
    <motion.div
      className="card group hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="text-center">
              <div className="text-sm font-medium text-primary-600 mb-2">FRONT</div>
              <div className="text-gray-900 font-medium leading-relaxed">
                {card.front}
              </div>
            </div>
          </div>
          <div className="flashcard-back bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <div className="text-center">
              <div className="text-sm font-medium text-green-600 mb-2">BACK</div>
              <div className="text-gray-900 font-medium leading-relaxed">
                {card.back}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="Reset card"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-500">
            Click to flip
          </span>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors duration-200"
            title="Edit card"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
            title="Delete card"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}
    </motion.div>
  )
}
