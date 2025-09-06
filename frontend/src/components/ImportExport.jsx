import React, { useState } from 'react'
import { useDeck } from '../context/DeckContext'
import { Download, Upload, FileText, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function ImportExport() {
  const { decks, flashcards, createDeck, createFlashcard } = useDeck()
  const [isImporting, setIsImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)

  const exportData = () => {
    const data = {
      decks: decks,
      flashcards: flashcards,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `educards-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsImporting(true)
    setImportSuccess(false)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.decks || !data.flashcards) {
        throw new Error('Invalid file format')
      }

      // Import decks
      for (const deck of data.decks) {
        try {
          await createDeck({
            name: deck.name,
            description: deck.description
          })
        } catch (error) {
          console.error('Error importing deck:', error)
        }
      }

      // Import flashcards
      for (const card of data.flashcards) {
        try {
          // Find the corresponding deck
          const deck = decks.find(d => d.name === card.deck_name)
          if (deck) {
            await createFlashcard(deck.id, {
              front: card.front,
              back: card.back,
              difficulty: card.difficulty || 1
            })
          }
        } catch (error) {
          console.error('Error importing flashcard:', error)
        }
      }

      setImportSuccess(true)
      setTimeout(() => setImportSuccess(false), 3000)
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed: Invalid file format')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Import & Export</h1>
        <p className="text-gray-600">Backup your data or import from other sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Data</h3>
            <p className="text-gray-600 mb-6">
              Download all your decks and flashcards as a JSON file
            </p>
            <button
              onClick={exportData}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Download className="h-5 w-5" />
              <span>Export All Data</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Data</h3>
            <p className="text-gray-600 mb-6">
              Upload a JSON file to restore your data
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className={`btn-primary flex items-center space-x-2 mx-auto cursor-pointer ${
                  isImporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Import Data</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {importSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
        >
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Data imported successfully!</span>
        </motion.div>
      )}

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{decks.length}</div>
            <div className="text-sm text-gray-600">Decks</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{flashcards.length}</div>
            <div className="text-sm text-gray-600">Flashcards</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>
      </div>
    </div>
  )
}
