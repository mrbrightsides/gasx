'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { RefreshCw, TrendingDown, Zap } from 'lucide-react'

interface ChainData {
  name: string
  displayName: string
  gasPrice: number
  gasCostETH: number
  gasCostIDR: number
  color: string
  rpcUrl: string
  chainId: number
  icon: string
}

interface MultiChainComparisonProps {
  marketData: {
    ethToUSD: number
    usdToIDR: number
  }
  transactionType: 'simple' | 'token' | 'swap' | 'nft' | 'complex'
}

export function MultiChainComparison({ marketData, transactionType = 'simple' }: MultiChainComparisonProps) {
  const [chainsData, setChainsData] = useState<ChainData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Gas limits for different transaction types
  const gasLimits: Record<string, number> = {
    simple: 21000,
    token: 65000,
    swap: 150000,
    nft: 85000,
    complex: 200000
  }

  const gasLimit = gasLimits[transactionType]

  // Chain configurations
  const chains: Omit<ChainData, 'gasPrice' | 'gasCostETH' | 'gasCostIDR'>[] = [
    {
      name: 'ethereum',
      displayName: 'Ethereum',
      color: '#627EEA',
      rpcUrl: 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206',
      chainId: 11155111,
      icon: '⟠'
    },
    {
      name: 'base',
      displayName: 'Base',
      color: '#0052FF',
      rpcUrl: 'https://sepolia.base.org',
      chainId: 84532,
      icon: '🔵'
    },
    {
      name: 'polygon',
      displayName: 'Polygon',
      color: '#8247E5',
      rpcUrl: 'https://rpc-amoy.polygon.technology',
      chainId: 80002,
      icon: '💜'
    },
    {
      name: 'arbitrum',
      displayName: 'Arbitrum',
      color: '#28A0F0',
      rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      icon: '🔷'
    },
    {
      name: 'optimism',
      displayName: 'Optimism',
      color: '#FF0420',
      rpcUrl: 'https://sepolia.optimism.io',
      chainId: 11155420,
      icon: '🔴'
    }
  ]

  const fetchGasPrice = async (rpcUrl: string): Promise<number> => {
    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'https',
          origin: rpcUrl.replace('https://', '').split('/')[0],
          path: '/' + rpcUrl.split('/').slice(3).join('/'),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 1
          })
        })
      })

      const data = await response.json()
      
      // Validate response
      if (!data || !data.result) {
        console.warn(`Invalid response from ${rpcUrl}:`, data)
        return 0.1 // Default for testnets
      }
      
      const gasPriceWei = parseInt(data.result, 16)
      
      // Check if parsing was successful
      if (isNaN(gasPriceWei)) {
        console.warn(`Invalid gas price from ${rpcUrl}:`, data.result)
        return 0.1 // Default for testnets
      }
      
      const gasPriceGwei = gasPriceWei / 1000000000
      return gasPriceGwei
    } catch (err) {
      console.error(`Failed to fetch gas price from ${rpcUrl}:`, err)
      // Return default/estimated values for each chain
      return 0.1 // Default low value for testnets
    }
  }

  const fetchAllChainData = async (): Promise<void> => {
    setIsLoading(true)
    setError('')

    try {
      const chainDataPromises = chains.map(async (chain) => {
        const gasPrice = await fetchGasPrice(chain.rpcUrl)
        
        // Ensure we have valid market data
        const ethToUSD = marketData.ethToUSD || 0
        const usdToIDR = marketData.usdToIDR || 0
        
        const gasCostETH = (gasLimit * gasPrice) / 1000000000
        const gasCostUSD = gasCostETH * ethToUSD
        const gasCostIDR = gasCostUSD * usdToIDR

        return {
          ...chain,
          gasPrice: isNaN(gasPrice) ? 0.1 : gasPrice,
          gasCostETH: isNaN(gasCostETH) ? 0 : gasCostETH,
          gasCostIDR: isNaN(gasCostIDR) ? 0 : gasCostIDR
        }
      })

      const results = await Promise.all(chainDataPromises)
      setChainsData(results.sort((a, b) => a.gasCostIDR - b.gasCostIDR))
    } catch (err) {
      setError('Failed to fetch multi-chain data. Please try again.')
      console.error('Multi-chain fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (marketData.ethToUSD > 0 && marketData.usdToIDR > 0) {
      fetchAllChainData()
    }
  }, [marketData.ethToUSD, marketData.usdToIDR, transactionType])

  const cheapestChain = chainsData.length > 0 ? chainsData[0] : null
  const mostExpensiveChain = chainsData.length > 0 ? chainsData[chainsData.length - 1] : null
  const savings = cheapestChain && mostExpensiveChain 
    ? ((mostExpensiveChain.gasCostIDR - cheapestChain.gasCostIDR) / mostExpensiveChain.gasCostIDR * 100).toFixed(1)
    : 0

  // Prepare chart data
  const chartData = chainsData.map(chain => ({
    name: chain.displayName,
    'Gas Fee (IDR)': Math.round(chain.gasCostIDR),
    'Gas Price (Gwei)': parseFloat(chain.gasPrice.toFixed(4))
  }))

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Multi-Chain Gas Comparison
              </CardTitle>
              <CardDescription>
                Bandingkan biaya gas di 5 blockchain: Ethereum, Base, Polygon, Arbitrum, Optimism
              </CardDescription>
            </div>
            <Button
              onClick={fetchAllChainData}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {!isLoading && cheapestChain && mostExpensiveChain && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Termurah
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {cheapestChain.icon} {cheapestChain.displayName}
                </p>
                <p className="text-lg font-semibold">
                  Rp {cheapestChain.gasCostIDR.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cheapestChain.gasPrice.toFixed(8)} Gwei
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Termahal</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {mostExpensiveChain.icon} {mostExpensiveChain.displayName}
                </p>
                <p className="text-lg font-semibold">
                  Rp {mostExpensiveChain.gasCostIDR.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mostExpensiveChain.gasPrice.toFixed(8)} Gwei
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {savings}%
                </p>
                <p className="text-lg font-semibold">
                  Rp {(mostExpensiveChain.gasCostIDR - cheapestChain.gasCostIDR).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hemat dengan memilih chain termurah
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Gas Fee Comparison Chart</CardTitle>
          <CardDescription>
            Biaya gas untuk {transactionType} transaction ({gasLimit.toLocaleString('id-ID')} gas limit)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'IDR', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Gas Fee (IDR)') {
                      return [`Rp ${value.toLocaleString('id-ID')}`, name]
                    }
                    return [value, name]
                  }}
                />
                <Legend />
                <Bar dataKey="Gas Fee (IDR)" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Detailed Chain List */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Chain Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {chainsData.map((chain, index) => (
                <Card 
                  key={chain.name}
                  className={`border-2 ${index === 0 ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{chain.icon}</span>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {chain.displayName}
                            {index === 0 && (
                              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                Cheapest
                              </Badge>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Gas Price: {chain.gasPrice.toFixed(8)} Gwei
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: chain.color }}>
                          Rp {chain.gasCostIDR.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chain.gasCostETH.toFixed(8)} ETH
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>💡 Layer 2 Advantage:</strong> Layer 2 solutions (Base, Arbitrum, Optimism, Polygon) 
            typically offer significantly lower gas fees compared to Ethereum mainnet while maintaining security and decentralization.
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• <strong>Base:</strong> Coinbase's Layer 2, ultra-low fees, perfect for consumer apps</li>
            <li>• <strong>Arbitrum:</strong> Optimistic rollup with high compatibility</li>
            <li>• <strong>Optimism:</strong> Pioneering optimistic rollup technology</li>
            <li>• <strong>Polygon:</strong> Sidechain with EVM compatibility and fast transactions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
