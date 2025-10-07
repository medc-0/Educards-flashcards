import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const DeckList = lazy(() => import('./components/DeckList').then(m => ({ default: m.DeckList })))
const DeckDetail = lazy(() => import('./components/DeckDetail').then(m => ({ default: m.DeckDetail })))
const StudyMode = lazy(() => import('./components/StudyMode').then(m => ({ default: m.StudyMode })))
const StatsDashboard = lazy(() => import('./components/StatsDashboard').then(m => ({ default: m.StatsDashboard })))
const ImportExport = lazy(() => import('./components/ImportExport').then(m => ({ default: m.ImportExport })))
const SpacedRepetition = lazy(() => import('./components/SpacedRepetition').then(m => ({ default: m.SpacedRepetition })))
import { Header } from './components/Header'
import { DeckProvider } from './context/DeckContext'

function App() {
  return (
    <DeckProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
              <Routes>
                <Route path="/" element={<DeckList />} />
                <Route path="/deck/:id" element={<DeckDetail />} />
                <Route path="/study/:id" element={<StudyMode />} />
                <Route path="/spaced-repetition" element={<SpacedRepetition />} />
                <Route path="/stats" element={<StatsDashboard />} />
                <Route path="/import-export" element={<ImportExport />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </DeckProvider>
  )
}

export default App
