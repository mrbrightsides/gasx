'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Settings, ShoppingCart, Plane, Users, Zap, TrendingDown, TrendingUp } from 'lucide-react'

interface ScenarioBuilderProps {
  marketData: {
    gasPrice: number
    ethToUSD: number
    usdToIDR: number
  }
}

interface Scenario {
  id: string
  name: string
  icon: React.ElementType
  description: string
  defaults: {
    txPerDay: number
    avgAmount: number
    otaFee: number
    bankFee: number
    adminFee: number
  }
}

const scenarios: Scenario[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Checkout',
    icon: ShoppingCart,
    description: 'Online store dengan checkout payment gateway',
    defaults: {
      txPerDay: 100,
      avgAmount: 250000,
      otaFee: 2.5,
      bankFee: 4500,
      adminFee: 0
    }
  },
  {
    id: 'travel',
    name: 'Travel Booking',
    icon: Plane,
    description: 'Hotel/flight booking dengan komisi OTA tinggi',
    defaults: {
      txPerDay: 20,
      avgAmount: 5000000,
      otaFee: 20,
      bankFee: 6500,
      adminFee: 50000
    }
  },
  {
    id: 'p2p',
    name: 'P2P Transfer',
    icon: Users,
    description: 'Peer-to-peer transfer/remittance sederhana',
    defaults: {
      txPerDay: 50,
      avgAmount: 500000,
      otaFee: 0,
      bankFee: 6500,
      adminFee: 0
    }
  }
]

export function ScenarioBuilder({ marketData }: ScenarioBuilderProps) {
  const [activeScenario, setActiveScenario] = useState<string>('ecommerce')
  const [txPerDay, setTxPerDay] = useState<number>(100)
  const [avgAmount, setAvgAmount] = useState<number>(250000)
  const [otaFee, setOtaFee] = useState<number>(2.5)
  const [bankFee, setBankFee] = useState<number>(4500)
  const [adminFee, setAdminFee] = useState<number>(0)

  const scenario = scenarios.find(s => s.id === activeScenario)

  // Load scenario defaults
  const loadScenario = (scenarioId: string) => {
    const s = scenarios.find(sc => sc.id === scenarioId)
    if (s) {
      setActiveScenario(scenarioId)
      setTxPerDay(s.defaults.txPerDay)
      setAvgAmount(s.defaults.avgAmount)
      setOtaFee(s.defaults.otaFee)
      setBankFee(s.defaults.bankFee)
      setAdminFee(s.defaults.adminFee)
    }
  }

  // Calculate costs
  const gasUsed = 21000 // Simple transfer
  const gasCostETH = (marketData.gasPrice * gasUsed * 0.000000001)
  const gasCostIDR = gasCostETH * marketData.ethToUSD * marketData.usdToIDR

  const onchainPerTx = gasCostIDR
  const offchainPerTx = bankFee + (avgAmount * otaFee / 100) + adminFee

  const onchainPerDay = onchainPerTx * txPerDay
  const offchainPerDay = offchainPerTx * txPerDay

  const onchainPerMonth = onchainPerDay * 30
  const offchainPerMonth = offchainPerDay * 30

  const onchainPerYear = onchainPerMonth * 12
  const offchainPerYear = offchainPerMonth * 12

  const savingsPerTx = offchainPerTx - onchainPerTx
  const savingsPerDay = offchainPerDay - onchainPerDay
  const savingsPerMonth = offchainPerMonth - onchainPerMonth
  const savingsPerYear = offchainPerYear - onchainPerYear

  const savingsPercent = ((Math.abs(savingsPerTx) / Math.max(onchainPerTx, offchainPerTx)) * 100).toFixed(1)
  const isOnchainCheaper = onchainPerTx < offchainPerTx

  // Break-even analysis
  const dailyVolume = avgAmount * txPerDay
  const monthlyVolume = dailyVolume * 30
  const yearlyVolume = monthlyVolume * 12

  // Chart data
  const comparisonData = [
    {
      period: 'Per Tx',
      'On-chain': Math.round(onchainPerTx),
      'Off-chain': Math.round(offchainPerTx)
    },
    {
      period: 'Per Day',
      'On-chain': Math.round(onchainPerDay),
      'Off-chain': Math.round(offchainPerDay)
    },
    {
      period: 'Per Month',
      'On-chain': Math.round(onchainPerMonth),
      'Off-chain': Math.round(offchainPerMonth)
    },
    {
      period: 'Per Year',
      'On-chain': Math.round(onchainPerYear),
      'Off-chain': Math.round(offchainPerYear)
    }
  ]

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-900 dark:to-emerald-900/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500 dark:bg-green-600">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Scenario Builder</CardTitle>
            <CardDescription>
              Model business scenarios with custom parameters and see projected costs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((s) => {
            const Icon = s.icon
            const isActive = activeScenario === s.id
            return (
              <Card
                key={s.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  isActive 
                    ? 'border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30' 
                    : 'border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                }`}
                onClick={() => loadScenario(s.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <CardTitle className="text-sm">{s.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {isActive && (
                    <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Parameter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scenario Parameters</CardTitle>
            <CardDescription>Adjust values to model your specific use case</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transaction Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Transaction Volume (per day)</Label>
                <Badge variant="outline" className="font-mono">{txPerDay} tx/day</Badge>
              </div>
              <Slider
                value={[txPerDay]}
                onValueChange={(v) => setTxPerDay(v[0])}
                min={1}
                max={1000}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Monthly: {txPerDay * 30} tx | Yearly: {txPerDay * 365} tx
              </p>
            </div>

            {/* Average Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Average Transaction Amount (IDR)</Label>
                <Badge variant="outline" className="font-mono">
                  Rp {avgAmount.toLocaleString('id-ID')}
                </Badge>
              </div>
              <Slider
                value={[avgAmount]}
                onValueChange={(v) => setAvgAmount(v[0])}
                min={10000}
                max={10000000}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Detailed Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="otaFee" className="text-sm">OTA Commission (%)</Label>
                <Input
                  id="otaFee"
                  type="number"
                  value={otaFee}
                  onChange={(e) => setOtaFee(Number(e.target.value))}
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">
                  ≈ Rp {((avgAmount * otaFee) / 100).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankFee" className="text-sm">Bank Transfer Fee (IDR)</Label>
                <Input
                  id="bankFee"
                  type="number"
                  value={bankFee}
                  onChange={(e) => setBankFee(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminFee" className="text-sm">Admin Fee (IDR)</Label>
                <Input
                  id="adminFee"
                  type="number"
                  value={adminFee}
                  onChange={(e) => setAdminFee(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className={`${isOnchainCheaper ? 'border-2 border-green-500 dark:border-green-400' : 'border border-gray-200 dark:border-gray-700'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground">Per Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Rp {onchainPerTx.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">On-chain</p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400 mt-2">
                Rp {offchainPerTx.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">Off-chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground">Per Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                Rp {onchainPerDay.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">On-chain</p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400 mt-2">
                Rp {offchainPerDay.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">Off-chain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground">Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                Rp {(onchainPerMonth / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">On-chain</p>
              <p className="text-xl font-semibold text-orange-600 dark:text-orange-400 mt-2">
                Rp {(offchainPerMonth / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs text-muted-foreground">Off-chain</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs text-muted-foreground flex items-center gap-1">
                {isOnchainCheaper ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                Savings/Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${isOnchainCheaper ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOnchainCheaper ? '+' : '-'}Rp {(Math.abs(savingsPerYear) / 1000000).toFixed(2)}M
              </p>
              <Badge className={`mt-2 ${isOnchainCheaper ? 'bg-green-500' : 'bg-red-500'} text-white text-xs`}>
                {savingsPercent}% {isOnchainCheaper ? 'Cheaper' : 'More Expensive'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cost Comparison by Period</CardTitle>
            <CardDescription>
              {scenario?.name} scenario: {txPerDay} tx/day, Rp {avgAmount.toLocaleString('id-ID')} avg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="period" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
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
                  formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
                />
                <Legend />
                <Bar dataKey="On-chain" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Off-chain" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Business Insights */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
              Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge className="bg-green-500 text-white">Volume</Badge>
              <p className="flex-1">
                <strong>Transaction Volume:</strong> {txPerDay} tx/day = {(txPerDay * 30).toLocaleString()} tx/month
                <br />
                <strong>Yearly Volume:</strong> Rp {(yearlyVolume / 1000000000).toFixed(2)} Miliar
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge className={isOnchainCheaper ? 'bg-green-500' : 'bg-orange-500'} className="text-white">ROI</Badge>
              <p className="flex-1">
                {isOnchainCheaper ? (
                  <>
                    <strong>Blockchain Advantage:</strong> Save Rp {(Math.abs(savingsPerYear) / 1000000).toFixed(2)}M per year ({savingsPercent}% reduction)
                    <br />
                    <strong>Monthly Savings:</strong> Rp {(Math.abs(savingsPerMonth) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}K
                  </>
                ) : (
                  <>
                    <strong>Off-chain Advantage:</strong> Off-chain saves Rp {(Math.abs(savingsPerYear) / 1000000).toFixed(2)}M per year
                    <br />
                    <strong>Consider:</strong> Layer 2 solutions (Base, Polygon) could reduce on-chain costs by 70-90%
                  </>
                )}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge className="bg-blue-500 text-white">Strategy</Badge>
              <p className="flex-1">
                {otaFee > 10 ? (
                  <>High OTA commission ({otaFee}%) makes blockchain attractive for this use case. Consider hybrid: blockchain for payment, traditional for user onboarding.</>
                ) : otaFee === 0 ? (
                  <>No commission model - cost comparison depends purely on gas vs bank fees. Monitor gas prices for optimal timing.</>
                ) : (
                  <>Moderate fees - optimal solution depends on transaction volume and timing. Use time-based analysis to maximize efficiency.</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
