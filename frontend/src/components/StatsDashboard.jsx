import React, { useState, useEffect } from 'react'
import { useDeck } from '../context/DeckContext'
import { BarChart3, TrendingUp, Clock, Target, BookOpen, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

export function StatsDashboard() {
  const { decks, flashcards } = useDeck()
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    totalReviews: 0,
    averageDifficulty: 0,
    studyStreak: 0,
    recentActivity: []
  })

  useEffect(() => {
    const totalDecks = decks.length
    const totalCards = flashcards.length
    const totalReviews = flashcards.reduce((sum, card) => sum + (card.review_count || 0), 0)
    const averageDifficulty = flashcards.length > 0 
      ? flashcards.reduce((sum, card) => sum + (card.difficulty || 1), 0) / flashcards.length 
      : 0

    setStats({
      totalDecks,
      totalCards,
      totalReviews,
      averageDifficulty: Math.round(averageDifficulty * 10) / 10,
      studyStreak: 7, // Placeholder - would be calculated from actual data
      recentActivity: flashcards
        .filter(card => card.last_reviewed)
        .sort((a, b) => new Date(b.last_reviewed) - new Date(a.last_reviewed))
        .slice(0, 5)
    })
  }, [decks, flashcards])

  const statCards = [
    {
      title: 'Total Decks',
      value: stats.totalDecks,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Cards',
      value: stats.totalCards,
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Study Streak',
      value: `${stats.studyStreak} days`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
        <p className="text-gray-600">Track your progress and learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((card, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{card.front.substring(0, 50)}...</p>
                    <p className="text-xs text-gray-500">
                      Reviewed {new Date(card.last_reviewed).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Average Difficulty</span>
              <span className="text-lg font-bold text-blue-600">{stats.averageDifficulty}/3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">Cards Mastered</span>
              <span className="text-lg font-bold text-green-600">
                {flashcards.filter(card => card.difficulty === 1).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-900">Needs Review</span>
              <span className="text-lg font-bold text-orange-600">
                {flashcards.filter(card => card.difficulty === 3).length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
