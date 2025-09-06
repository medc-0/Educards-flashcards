import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDeck } from '../context/DeckContext'
import { ArrowLeft, Plus, Play, Edit2, Trash2, RotateCcw } from 'lucide-react'
import { CreateFlashcardModal } from './CreateFlashcardModal'
import { Flashcard } from './Flashcard'
import { motion } from 'framer-motion'

export function DeckDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    currentDeck, 
    flashcards, 
    loading, 
    error, 
    fetchFlashcards, 
    createFlashcard, 
    updateFlashcard, 
    deleteFlashcard,
    setCurrentDeck 
  } = useDeck()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (id) {
      fetchFlashcards(id)
    }
  }, [id, fetchFlashcards])

  const handleCreateCard = async (cardData) => {
    try {
      await createFlashcard(id, cardData)
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create flashcard:', error)
    }
  }

  const handleUpdateCard = async (cardId, cardData) => {
    try {
      await updateFlashcard(cardId, cardData)
      setEditingCard(null)
    } catch (error) {
      console.error('Failed to update flashcard:', error)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      setDeletingId(cardId)
      try {
        await deleteFlashcard(cardId)
      } catch (error) {
        console.error('Failed to delete flashcard:', error)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const canStudy = flashcards.length > 0

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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentDeck?.name || 'Deck'}
            </h1>
            <p className="text-gray-600">
              {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Card</span>
          </button>
          {canStudy && (
            <button
              onClick={() => navigate(`/study/${id}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Study</span>
            </button>
          )}
        </div>
      </div>

      {flashcards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards yet</h3>
          <p className="text-gray-600 mb-6">Add your first flashcard to start building this deck</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Add Your First Card
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Flashcard
                card={card}
                onEdit={() => setEditingCard(card)}
                onDelete={() => handleDeleteCard(card.id)}
                isDeleting={deletingId === card.id}
              />
            </motion.div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateFlashcardModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCard}
        />
      )}

      {editingCard && (
        <CreateFlashcardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onSubmit={(cardData) => handleUpdateCard(editingCard.id, cardData)}
        />
      )}
    </div>
  )
}
