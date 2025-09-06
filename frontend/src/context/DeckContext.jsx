import React, { createContext, useContext, useReducer, useEffect } from 'react'

const DeckContext = createContext()

const initialState = {
  decks: [],
  currentDeck: null,
  flashcards: [],
  loading: false,
  error: null
}

function deckReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_DECKS':
      return { ...state, decks: action.payload, loading: false, error: null }
    case 'ADD_DECK':
      return { ...state, decks: [...state.decks, action.payload] }
    case 'UPDATE_DECK':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.payload.id ? action.payload : deck
        )
      }
    case 'DELETE_DECK':
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.payload)
      }
    case 'SET_CURRENT_DECK':
      return { ...state, currentDeck: action.payload }
    case 'SET_FLASHCARDS':
      return { ...state, flashcards: action.payload }
    case 'ADD_FLASHCARD':
      return { ...state, flashcards: [...state.flashcards, action.payload] }
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.map(card =>
          card.id === action.payload.id ? action.payload : card
        )
      }
    case 'DELETE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.filter(card => card.id !== action.payload)
      }
    default:
      return state
  }
}

export function DeckProvider({ children }) {
  const [state, dispatch] = useReducer(deckReducer, initialState)

  // API functions
  const apiCall = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  // Deck functions
  const fetchDecks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const decks = await apiCall('/api/decks')
      dispatch({ type: 'SET_DECKS', payload: decks })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const createDeck = async (deckData) => {
    try {
      const newDeck = await apiCall('/api/decks', {
        method: 'POST',
        body: JSON.stringify(deckData)
      })
      dispatch({ type: 'ADD_DECK', payload: newDeck })
      return newDeck
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateDeck = async (id, deckData) => {
    try {
      const updatedDeck = await apiCall(`/api/decks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(deckData)
      })
      dispatch({ type: 'UPDATE_DECK', payload: updatedDeck })
      return updatedDeck
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const deleteDeck = async (id) => {
    try {
      await apiCall(`/api/decks/${id}`, { method: 'DELETE' })
      dispatch({ type: 'DELETE_DECK', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // Flashcard functions
  const fetchFlashcards = async (deckId) => {
    try {
      const flashcards = await apiCall(`/api/decks/${deckId}/flashcards`)
      dispatch({ type: 'SET_FLASHCARDS', payload: flashcards })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const createFlashcard = async (deckId, cardData) => {
    try {
      const newCard = await apiCall(`/api/decks/${deckId}/flashcards`, {
        method: 'POST',
        body: JSON.stringify(cardData)
      })
      dispatch({ type: 'ADD_FLASHCARD', payload: newCard })
      return newCard
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateFlashcard = async (id, cardData) => {
    try {
      const updatedCard = await apiCall(`/api/flashcards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cardData)
      })
      dispatch({ type: 'UPDATE_FLASHCARD', payload: updatedCard })
      return updatedCard
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const deleteFlashcard = async (id) => {
    try {
      await apiCall(`/api/flashcards/${id}`, { method: 'DELETE' })
      dispatch({ type: 'DELETE_FLASHCARD', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateFlashcardReview = async (id, difficulty) => {
    try {
      await apiCall(`/api/flashcards/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify({ difficulty })
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // Load decks on mount
  useEffect(() => {
    fetchDecks()
  }, [])

  const value = {
    ...state,
    fetchDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    updateFlashcardReview,
    setCurrentDeck: (deck) => dispatch({ type: 'SET_CURRENT_DECK', payload: deck })
  }

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  )
}

export function useDeck() {
  const context = useContext(DeckContext)
  if (!context) {
    throw new Error('useDeck must be used within a DeckProvider')
  }
  return context
}
