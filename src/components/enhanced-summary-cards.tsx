'use client'

import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Zap } from 'lucide-react'

interface SummaryCardsProps {
  averageGasFeeIDR: number
  averageOffchainCost: number
  onchainCheaperCount: number
  totalCount: number
  totalSavings: number
}

export function EnhancedSummaryCards({
  averageGasFeeIDR,
  averageOffchainCost,
  onchainCheaperCount,
  totalCount,
  totalSavings
}: SummaryCardsProps) {
  const savingsPercentage = ((onchainCheaperCount / totalCount) * 100).toFixed(1)
  const isOnchainCheaper = averageGasFeeIDR < averageOffchainCost
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* On-chain Cost */}
      <Card className="relative overflow-hidden border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardDescription className="text-blue-700 dark:text-blue-300 font-medium">
              Avg On-chain Cost
            </CardDescription>
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            Rp {averageGasFeeIDR.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </CardTitle>
          <div className="flex items-center gap-1 mt-2">
            {isOnchainCheaper ? (
              <TrendingDown className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-xs font-medium ${isOnchainCheaper ? 'text-green-600' : 'text-red-600'}`}>
              {isOnchainCheaper ? 'Lower' : 'Higher'} than off-chain
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Off-chain Cost */}
      <Card className="relative overflow-hidden border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 hover:shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardDescription className="text-orange-700 dark:text-orange-300 font-medium">
              Avg Off-chain Cost
            </CardDescription>
            <div className="h-5 w-5 flex items-center justify-center rounded bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold text-sm">
              Rp
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-orange-700 dark:text-orange-300">
            Rp {averageOffchainCost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </CardTitle>
          <div className="flex items-center gap-1 mt-2">
            {!isOnchainCheaper ? (
              <TrendingDown className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-xs font-medium ${!isOnchainCheaper ? 'text-green-600' : 'text-red-600'}`}>
              {!isOnchainCheaper ? 'Lower' : 'Higher'} than on-chain
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Success Rate */}
      <Card className="relative overflow-hidden border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardDescription className="text-green-700 dark:text-green-300 font-medium">
              On-chain Cheaper
            </CardDescription>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-700 dark:text-green-300">
            {onchainCheaperCount}/{totalCount}
          </CardTitle>
          <div className="flex items-center gap-1 mt-2">
            <div className={`w-2 h-2 rounded-full ${parseFloat(savingsPercentage) > 50 ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {savingsPercentage}% success rate
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Total Savings */}
      <Card className="relative overflow-hidden border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="pb-4 relative">
          <div className="flex items-center justify-between">
            <CardDescription className="text-purple-700 dark:text-purple-300 font-medium">
              Total Potential Savings
            </CardDescription>
            <div className="h-5 w-5 flex items-center justify-center rounded bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-sm">
              Rp
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-purple-700 dark:text-purple-300">
            Rp {totalSavings.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </CardTitle>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-100" />
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-200" />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Accumulated savings
            </span>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}