'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Clock, TrendingDown, TrendingUp, Calendar, RefreshCw } from 'lucide-react'

interface TimeBasedAnalysisProps {
  marketData: {
    gasPrice: number
    ethToUSD: number
    usdToIDR: number
  }
}

export function TimeBasedAnalysis({ marketData }: TimeBasedAnalysisProps) {
  const [historicalData, setHistoricalData] = useState<Array<{
    hour: string
    avgGasPrice: number
    avgCostIDR: number
    volume: number
  }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  // Generate simulated historical data based on typical gas price patterns
  const generateHistoricalData = () => {
    setIsLoading(true)
    
    const data = []
    const currentGas = marketData.gasPrice || 15
    
    // Typical gas price patterns (UTC time)
    // Low: 2-6 AM (Asian night)
    // Medium: 7-12 AM, 7-11 PM
    // High: 1-6 PM (US/EU peak)
    
    if (timeframe === '24h') {
      for (let i = 0; i < 24; i++) {
        let multiplier = 1
        if (i >= 2 && i < 6) multiplier = 0.6 // Night - lowest
        else if (i >= 13 && i < 18) multiplier = 1.4 // Afternoon - highest
        else if (i >= 7 && i < 12) multiplier = 0.9 // Morning - medium-low
        else if (i >= 19 && i < 23) multiplier = 1.1 // Evening - medium-high
        
        const gasPrice = currentGas * multiplier * (0.9 + Math.random() * 0.2)
        const costIDR = (gasPrice * 21000 * 0.000000001) * marketData.ethToUSD * marketData.usdToIDR
        
        data.push({
          hour: `${i.toString().padStart(2, '0')}:00 UTC`,
          avgGasPrice: parseFloat(gasPrice.toFixed(2)),
          avgCostIDR: parseFloat(costIDR.toFixed(0)),
          volume: Math.floor(1000 + Math.random() * 4000)
        })
      }
    } else if (timeframe === '7d') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      days.forEach((day, i) => {
        // Weekends typically lower
        const multiplier = (i >= 5) ? 0.8 : 1
        const gasPrice = currentGas * multiplier * (0.85 + Math.random() * 0.3)
        const costIDR = (gasPrice * 21000 * 0.000000001) * marketData.ethToUSD * marketData.usdToIDR
        
        data.push({
          hour: day,
          avgGasPrice: parseFloat(gasPrice.toFixed(2)),
          avgCostIDR: parseFloat(costIDR.toFixed(0)),
          volume: Math.floor(8000 + Math.random() * 12000)
        })
      })
    } else { // 30d
      for (let i = 1; i <= 30; i++) {
        const gasPrice = currentGas * (0.7 + Math.random() * 0.6)
        const costIDR = (gasPrice * 21000 * 0.000000001) * marketData.ethToUSD * marketData.usdToIDR
        
        data.push({
          hour: `Day ${i}`,
          avgGasPrice: parseFloat(gasPrice.toFixed(2)),
          avgCostIDR: parseFloat(costIDR.toFixed(0)),
          volume: Math.floor(30000 + Math.random() * 20000)
        })
      }
    }
    
    setHistoricalData(data)
    setTimeout(() => setIsLoading(false), 500)
  }

  useEffect(() => {
    generateHistoricalData()
  }, [timeframe, marketData])

  // Find best and worst times
  const bestTime = historicalData.reduce((min, item) => 
    item.avgGasPrice < min.avgGasPrice ? item : min
  , historicalData[0] || { hour: '-', avgGasPrice: 0, avgCostIDR: 0, volume: 0 })
  
  const worstTime = historicalData.reduce((max, item) => 
    item.avgGasPrice > max.avgGasPrice ? item : max
  , historicalData[0] || { hour: '-', avgGasPrice: 0, avgCostIDR: 0, volume: 0 })

  const avgGasPrice = historicalData.reduce((sum, item) => sum + item.avgGasPrice, 0) / (historicalData.length || 1)
  const potentialSavings = worstTime.avgCostIDR - bestTime.avgCostIDR
  const savingsPercent = ((potentialSavings / worstTime.avgCostIDR) * 100).toFixed(1)

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-cyan-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500 dark:bg-blue-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Time-Based Analysis</CardTitle>
              <CardDescription>
                Find the optimal time to transact and save on gas fees
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateHistoricalData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeframe Selector */}
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as '24h' | '7d' | '30d')}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                Best Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {bestTime.hour}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bestTime.avgGasPrice.toFixed(2)} Gwei
                </p>
                <Badge className="bg-green-500 text-white text-xs">
                  Lowest Cost
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                Worst Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {worstTime.hour}
                </p>
                <p className="text-xs text-muted-foreground">
                  {worstTime.avgGasPrice.toFixed(2)} Gwei
                </p>
                <Badge className="bg-red-500 text-white text-xs">
                  Highest Cost
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Avg Gas Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {avgGasPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Gwei average
                </p>
                <Badge className="bg-purple-500 text-white text-xs">
                  {timeframe === '24h' ? '24h Avg' : timeframe === '7d' ? 'Weekly' : 'Monthly'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Potential Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {savingsPercent}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Rp {potentialSavings.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </p>
                <Badge className="bg-blue-500 text-white text-xs">
                  By Timing Right
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gas Price Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gas Price Trends</CardTitle>
            <CardDescription>Historical gas price patterns over {timeframe}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Gas Price (Gwei)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#000' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgGasPrice" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Avg Gas Price (Gwei)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Cost by Time</CardTitle>
            <CardDescription>Estimated cost in IDR for a simple transfer (21k gas)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Cost (IDR)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#000' }}
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Cost']}
                />
                <Bar 
                  dataKey="avgCostIDR" 
                  fill="#8b5cf6"
                  name="Cost (IDR)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Timing Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-green-500 text-white">Best</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Optimal Transaction Window</p>
                <p className="text-xs text-muted-foreground">
                  {timeframe === '24h' 
                    ? 'Transact between 2-6 AM UTC (typically 9 AM - 1 PM WIB) for lowest gas prices'
                    : timeframe === '7d'
                    ? 'Weekends (Saturday-Sunday) typically have 15-20% lower gas fees'
                    : 'Mid-month periods often see more stable and lower gas prices'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-red-500 text-white">Avoid</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">High Traffic Periods</p>
                <p className="text-xs text-muted-foreground">
                  {timeframe === '24h'
                    ? 'Avoid 1-6 PM UTC (8 PM - 1 AM WIB) when US/EU markets are most active'
                    : timeframe === '7d'
                    ? 'Weekdays (Monday-Friday) see higher transaction volumes'
                    : 'Month-end and major crypto events typically cause gas spikes'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-purple-500 text-white">Tip</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Pro Strategy</p>
                <p className="text-xs text-muted-foreground">
                  Use gas price alerts or schedule transactions during low-traffic periods. Consider Layer 2 solutions for urgent transactions during peak times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
