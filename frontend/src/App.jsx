import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DeckList } from './components/DeckList'
import { DeckDetail } from './components/DeckDetail'
import { StudyMode } from './components/StudyMode'
import { StatsDashboard } from './components/StatsDashboard'
import { ImportExport } from './components/ImportExport'
import { SpacedRepetition } from './components/SpacedRepetition'
import { Header } from './components/Header'
import { DeckProvider } from './context/DeckContext'

function App() {
  return (
    <DeckProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<DeckList />} />
              <Route path="/deck/:id" element={<DeckDetail />} />
              <Route path="/study/:id" element={<StudyMode />} />
              <Route path="/spaced-repetition" element={<SpacedRepetition />} />
              <Route path="/stats" element={<StatsDashboard />} />
              <Route path="/import-export" element={<ImportExport />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DeckProvider>
  )
}

export default App
