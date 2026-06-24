'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Fuel } from 'lucide-react'
import { format } from 'date-fns'

interface MarketData {
  ethToUSD: number
  usdToIDR: number
  gasPrice: number
  lastUpdated: string
}

interface MarketDataPanelProps {
  marketData: MarketData
  isLoading: boolean
  onRefresh: () => Promise<void>
}

export function MarketDataPanel({ marketData, isLoading, onRefresh }: MarketDataPanelProps) {
  const formatCurrency = (value: number, currency: string): string => {
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      case 'IDR':
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0
        }).format(value)
      default:
        return value.toLocaleString()
    }
  }

  const getGasPriceStatus = (gasPrice: number): { status: string; icon: JSX.Element; color: string } => {
    if (gasPrice < 10) {
      return { status: 'Low', icon: <TrendingDown className="h-4 w-4" />, color: 'text-green-600' }
    } else if (gasPrice < 20) {
      return { status: 'Normal', icon: <TrendingUp className="h-4 w-4" />, color: 'text-yellow-600' }
    } else {
      return { status: 'High', icon: <TrendingUp className="h-4 w-4" />, color: 'text-red-600' }
    }
  }

  const gasPriceStatus = getGasPriceStatus(marketData.gasPrice)

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Real-time Market Data
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Live pricing data for accurate cost calculations
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ETH Price */}
          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-white/20 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ETH Price</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(marketData.ethToUSD, 'USD')}
                </p>
              </>
            )}
          </div>

          {/* USD to IDR Rate */}
          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-white/20 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">USD to IDR</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(marketData.usdToIDR, 'IDR')}
                </p>
              </>
            )}
          </div>

          {/* Gas Price */}
          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-white/20 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Fuel className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gas Price</p>
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {marketData.gasPrice.toFixed(8)} Gwei
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {gasPriceStatus.icon}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${gasPriceStatus.color}`}
                  >
                    {gasPriceStatus.status}
                  </Badge>
                </div>
              </>
            )}
          </div>

          {/* Last Updated */}
          <div className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border border-white/20 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {marketData.lastUpdated ? 
                    format(new Date(marketData.lastUpdated), 'HH:mm:ss') : 
                    'Never'
                  }
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {marketData.lastUpdated ? 
                    format(new Date(marketData.lastUpdated), 'dd/MM/yyyy') : 
                    ''
                  }
                </p>
              </>
            )}
          </div>
        </div>

        {/* Data Sources Info */}
        <div className="mt-4 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg border-dashed border border-gray-300 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">Data Sources:</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>• ETH Price: CoinGecko API</span>
            <span>• Exchange Rate: Frankfurter API</span>
            <span>• Gas Price: Infura Sepolia Network</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}