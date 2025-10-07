import React, { useMemo, useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useDeck } from '../context/DeckContext'
import { Plus, BookOpen, Play, Edit2, Trash2, BarChart3 } from 'lucide-react'
import { CreateDeckModal } from './CreateDeckModal'
import { motion } from 'framer-motion'

function DeckListInner() {
  const { decks, flashcards, loading, error, deleteDeck } = useDeck()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleDeleteDeck = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      setDeletingId(id)
      try {
        await deleteDeck(id)
      } catch (error) {
        console.error('Failed to delete deck:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }, [deleteDeck])

  const deckIdToCount = useMemo(() => {
    const counts = new Map()
    for (const card of flashcards) {
      const current = counts.get(card.deck_id) || 0
      counts.set(card.deck_id, current + 1)
    }
    return counts
  }, [flashcards])

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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Decks</h1>
          <p className="text-gray-600">Organize and study your flashcards efficiently</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Deck</span>
        </button>
      </div>

      {decks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No decks yet</h3>
          <p className="text-gray-600 mb-6">Create your first deck to start learning with flashcards</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Deck
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, index) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{deck.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {deck.description || 'No description provided'}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    disabled={deletingId === deck.id}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <BarChart3 className="h-4 w-4" />
                  <span>{deckIdToCount.get(deck.id) || 0} cards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/deck/${deck.id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    title="Edit deck"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/study/${deck.id}`}
                    className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    title="Study deck"
                  >
                    <Play className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateDeckModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export const DeckList = memo(DeckListInner)
