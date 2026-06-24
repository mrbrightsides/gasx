'use client'

import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { Zap, Github, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EnhancedHeader() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-white/5" />
      
      {/* Content */}
      <div className="relative text-center space-y-4 py-12">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com/mrbrightsides" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse" />
            <div className="absolute inset-0 h-10 w-10 text-blue-600 dark:text-blue-400 animate-ping opacity-20">
              <Zap className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            STC GasX
          </h1>
        </div>

        <div className="space-y-2">
          <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium">
            Web3 Cost Comparator
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Analyze on-chain gas fees vs off-chain transaction costs with real-time data and professional visualizations
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <Badge variant="secondary" className="text-sm py-1.5 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            Real-time Gas Tracking
          </Badge>
          <Badge variant="secondary" className="text-sm py-1.5 px-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
            Multi-Currency Support
          </Badge>
          <Badge variant="secondary" className="text-sm py-1.5 px-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <ExternalLink className="h-3 w-3 mr-1" />
            Academic Ready
          </Badge>
        </div>
      </div>
    </div>
  )
}