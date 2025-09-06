import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

export function CreateFlashcardModal({ card, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    front: '',
    back: '',
    difficulty: 1
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (card) {
      setFormData({
        front: card.front || '',
        back: card.back || '',
        difficulty: card.difficulty || 1
      })
    }
  }, [card])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.front.trim() || !formData.back.trim()) return

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save flashcard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {card ? 'Edit Flashcard' : 'Create New Flashcard'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
                Front *
              </label>
              <textarea
                id="front"
                name="front"
                value={formData.front}
                onChange={handleChange}
                className="input-field resize-none"
                rows="6"
                placeholder="Enter the question or prompt"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
                Back *
              </label>
              <textarea
                id="back"
                name="back"
                value={formData.back}
                onChange={handleChange}
                className="input-field resize-none"
                rows="6"
                placeholder="Enter the answer or explanation"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="input-field"
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </div>

          <div className="mt-8 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !formData.front.trim() || !formData.back.trim()}
            >
              {loading ? (card ? 'Updating...' : 'Creating...') : (card ? 'Update Card' : 'Create Card')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
