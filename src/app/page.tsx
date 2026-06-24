'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CostComparisonChart } from '@/components/cost-comparison-chart'
import { GasTrendChart } from '@/components/gas-trend-chart'
import { FeeBreakdownChart } from '@/components/fee-breakdown-chart'
import { DataTable } from '@/components/data-table'
import { CSVUpload } from '@/components/csv-upload'
import { ExportButtons } from '@/components/export-buttons'
import { MarketDataPanel } from '@/components/market-data-panel'
import { EnhancedHeader } from '@/components/enhanced-header'
import { EnhancedSummaryCards } from '@/components/enhanced-summary-cards'
import AboutSection from '@/components/AboutSection'
import { CostCalculator } from '@/components/cost-calculator'
import { SampleDataLoader } from '@/components/sample-data-loader'
import { MultiChainComparison } from '@/components/multi-chain-comparison'
import { SmartRecommendations } from '@/components/smart-recommendations'
import { TimeBasedAnalysis } from '@/components/time-based-analysis'
import { ScenarioBuilder } from '@/components/scenario-builder'
import { PDFExport } from '@/components/pdf-export'
import { GasPriceAlerts } from '@/components/gas-price-alerts'
import { ShareAnalysis } from '@/components/share-analysis'
import { DeveloperAPI } from '@/components/developer-api'
import { TransactionSimulator } from '@/components/transaction-simulator'
import { RegionalComparison } from '@/components/regional-comparison'
import { CarbonFootprint } from '@/components/carbon-footprint'
import { Calculator, TrendingUp, PieChart, Upload, Download, Zap, Info, Layers, Lightbulb, Clock, Settings, FileText, Bell, Share2, Code, Wallet, Globe, Leaf } from 'lucide-react'
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";

interface TransactionData {
  timestamp: string
  txHash: string
  gasUsed: number
  gasPriceGwei: number
  feeETH: number
  feeIDR: number
}

interface MarketData {
  ethToUSD: number
  usdToIDR: number
  gasPrice: number
  lastUpdated: string
}

interface OffchainCosts {
  bankTransferFee: number
  otaCommissionPercent: number
  adminFee: number
  baseTransactionAmount: number
}

export default function STC_GasX() {
    const { addMiniApp } = useAddMiniApp();
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  // Market Data State
  const [marketData, setMarketData] = useState<MarketData>({
    ethToUSD: 0,
    usdToIDR: 0,
    gasPrice: 0,
    lastUpdated: ''
  })

  // Transaction Data State
  const [transactionData, setTransactionData] = useState<TransactionData[]>([])

  // Off-chain Costs State
  const [offchainCosts, setOffchainCosts] = useState<OffchainCosts>({
    bankTransferFee: 6500,
    otaCommissionPercent: 20,
    adminFee: 25000,
    baseTransactionAmount: 500000
  })

  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('dashboard')

  // Load sample data on mount
  useEffect(() => {
    const sampleData: TransactionData[] = [
      { timestamp: '2025-01-17 10:21:05', txHash: '0xabc123', gasUsed: 21000, gasPriceGwei: 15, feeETH: 0.000315, feeIDR: 7400 },
      { timestamp: '2025-01-17 10:25:42', txHash: '0xdef456', gasUsed: 48000, gasPriceGwei: 18, feeETH: 0.000864, feeIDR: 20300 },
      { timestamp: '2025-01-17 10:33:18', txHash: '0xghi789', gasUsed: 52000, gasPriceGwei: 20, feeETH: 0.00104, feeIDR: 24400 },
      { timestamp: '2025-01-17 10:40:55', txHash: '0xjkl012', gasUsed: 25000, gasPriceGwei: 14, feeETH: 0.00035, feeIDR: 8200 },
      { timestamp: '2025-01-17 10:45:30', txHash: '0xmnq345', gasUsed: 30000, gasPriceGwei: 17, feeETH: 0.00051, feeIDR: 11950 },
      { timestamp: '2025-01-17 10:52:44', txHash: '0xprs678', gasUsed: 41000, gasPriceGwei: 16, feeETH: 0.000656, feeIDR: 15380 },
      { timestamp: '2025-01-17 11:00:01', txHash: '0xtuv901', gasUsed: 22000, gasPriceGwei: 19, feeETH: 0.000418, feeIDR: 9800 },
      { timestamp: '2025-01-17 11:08:22', txHash: '0xwxy234', gasUsed: 33000, gasPriceGwei: 21, feeETH: 0.000693, feeIDR: 16200 },
    ]
    setTransactionData(sampleData)
    fetchMarketData()
  }, [])

  // Fetch real-time market data
  const fetchMarketData = async (): Promise<void> => {
    setIsLoading(true)
    setError('')
    
    try {
      // Fetch ETH price from CoinGecko
      const ethPriceResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.coingecko.com',
          path: '/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
          method: 'GET',
          headers: {}
        })
      })
      const ethPriceData = await ethPriceResponse.json()

      // Fetch USD to IDR exchange rate
      const exchangeRateResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.frankfurter.app',
          path: '/latest?from=USD&to=IDR',
          method: 'GET',
          headers: {}
        })
      })
      const exchangeRateData = await exchangeRateResponse.json()

      // Fetch gas price from Infura
      const gasPriceResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'sepolia.infura.io',
          path: '/v3/f8d248f838ec4f12b0f01efd2b238206',
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
      const gasPriceData = await gasPriceResponse.json()

      // Convert gas price from hex to gwei
      const gasPriceWei = parseInt(gasPriceData.result, 16)
      const gasPriceGwei = gasPriceWei / 1000000000

      setMarketData({
        ethToUSD: ethPriceData.ethereum.usd,
        usdToIDR: exchangeRateData.rates.IDR,
        gasPrice: gasPriceGwei,
        lastUpdated: new Date().toISOString()
      })
    } catch (err) {
      setError('Failed to fetch market data. Using cached values.')
      console.error('Market data fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate comparison data
  const getComparisonData = () => {
    return transactionData.map(tx => {
      const bankFee = offchainCosts.bankTransferFee
      // Use baseTransactionAmount for OTA commission calculation
      const otaCommission = (offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent) / 100
      const adminFee = offchainCosts.adminFee
      const offchainTotal = bankFee + otaCommission + adminFee
      
      return {
        ...tx,
        bankFee,
        otaCommission,
        adminFee,
        offchainTotal,
        isOnchainCheaper: tx.feeIDR < offchainTotal,
        savings: Math.abs(tx.feeIDR - offchainTotal),
        savingsPercent: ((Math.abs(tx.feeIDR - offchainTotal) / Math.max(tx.feeIDR, offchainTotal)) * 100).toFixed(1)
      }
    })
  }

  const comparisonData = getComparisonData()
  const averageGasFeeIDR = comparisonData.reduce((sum, item) => sum + item.feeIDR, 0) / comparisonData.length
  const averageOffchainCost = comparisonData.reduce((sum, item) => sum + item.offchainTotal, 0) / comparisonData.length
  const onchainCheaperCount = comparisonData.filter(item => item.isOnchainCheaper).length
  const totalSavings = comparisonData.reduce((sum, item) => sum + item.savings, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-500">
      {/* Enhanced Header */}
      <EnhancedHeader />
      
      <div className="max-w-7xl mx-auto space-y-8 px-4 py-8">

        {/* Error Alert */}
        {error && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <AlertDescription className="text-orange-700 dark:text-orange-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Market Data Panel */}
        <MarketDataPanel 
          marketData={marketData} 
          isLoading={isLoading} 
          onRefresh={fetchMarketData}
        />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative w-full max-w-7xl mx-auto mb-6">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-max min-w-full gap-1 p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Calculator className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Zap className="h-4 w-4" />
                <span>Kalkulator</span>
              </TabsTrigger>
              <TabsTrigger value="multichain" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Layers className="h-4 w-4" />
                <span>Multi-Chain</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trends</span>
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <PieChart className="h-4 w-4" />
                <span>Breakdown</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Upload className="h-4 w-4" />
                <span>Data</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Lightbulb className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Clock className="h-4 w-4" />
                <span>Timing</span>
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Settings className="h-4 w-4" />
                <span>Scenarios</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <FileText className="h-4 w-4" />
                <span>Export</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="share" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Code className="h-4 w-4" />
                <span>API</span>
              </TabsTrigger>
              <TabsTrigger value="simulate" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Wallet className="h-4 w-4" />
                <span>Simulate</span>
              </TabsTrigger>
              <TabsTrigger value="regional" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Globe className="h-4 w-4" />
                <span>Regional</span>
              </TabsTrigger>
              <TabsTrigger value="carbon" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Leaf className="h-4 w-4" />
                <span>Carbon</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2 whitespace-nowrap px-4 py-2">
                <Info className="h-4 w-4" />
                <span>Tentang</span>
              </TabsTrigger>
            </TabsList>
            </div>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Enhanced Summary Cards */}
            <EnhancedSummaryCards 
              averageGasFeeIDR={averageGasFeeIDR}
              averageOffchainCost={averageOffchainCost}
              onchainCheaperCount={onchainCheaperCount}
              totalCount={comparisonData.length}
              totalSavings={totalSavings}
            />

            {/* Cost Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>On-chain vs Off-chain Cost Comparison</CardTitle>
                <CardDescription>
                  Comparing gas fees with traditional payment costs per transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CostComparisonChart data={comparisonData} />
              </CardContent>
            </Card>

            {/* Parameter Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Off-chain Cost Parameters</CardTitle>
                <CardDescription>
                  Adjust the off-chain costs to see how they compare with on-chain gas fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseAmount" className="flex items-center gap-2">
                      💰 Base Transaction Amount (IDR)
                    </Label>
                    <Input
                      id="baseAmount"
                      type="number"
                      value={offchainCosts.baseTransactionAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setOffchainCosts({...offchainCosts, baseTransactionAmount: Number(e.target.value)})
                      }
                      className="text-lg font-semibold"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nominal transaksi untuk perhitungan komisi OTA
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankFee">Bank Transfer Fee (IDR)</Label>
                    <Input
                      id="bankFee"
                      type="number"
                      value={offchainCosts.bankTransferFee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setOffchainCosts({...offchainCosts, bankTransferFee: Number(e.target.value)})
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otaCommission">OTA Commission (%)</Label>
                    <Input
                      id="otaCommission"
                      type="number"
                      value={offchainCosts.otaCommissionPercent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setOffchainCosts({...offchainCosts, otaCommissionPercent: Number(e.target.value)})
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Komisi: Rp {((offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent) / 100).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminFee">Admin Fee (IDR)</Label>
                    <Input
                      id="adminFee"
                      type="number"
                      value={offchainCosts.adminFee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setOffchainCosts({...offchainCosts, adminFee: Number(e.target.value)})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <CostCalculator 
              marketData={marketData}
              offchainCosts={offchainCosts}
            />
          </TabsContent>

          {/* Multi-Chain Tab */}
          <TabsContent value="multichain" className="space-y-6">
            <MultiChainComparison 
              marketData={marketData}
              transactionType="simple"
            />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gas Fee vs Off-chain Cost Trends</CardTitle>
                <CardDescription>
                  Historical comparison showing gas fee fluctuation vs stable off-chain costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GasTrendChart data={comparisonData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown Analysis</CardTitle>
                <CardDescription>
                  Pie chart showing the composition of off-chain costs vs on-chain gas fees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeeBreakdownChart 
                  data={comparisonData} 
                  offchainCosts={offchainCosts} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            {/* Sample Data Loader */}
            <SampleDataLoader 
              onLoadData={setTransactionData}
              currentDataCount={transactionData.length}
            />

            {/* CSV Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Import Transaction Data</CardTitle>
                <CardDescription>
                  Upload CSV data exported from STC Analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUpload onDataUpload={setTransactionData} />
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transaction Analysis</CardTitle>
                  <CardDescription>
                    Detailed comparison of each transaction
                  </CardDescription>
                </div>
                <ExportButtons data={comparisonData} />
              </CardHeader>
              <CardContent>
                <DataTable data={comparisonData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <SmartRecommendations 
              comparisonData={comparisonData}
              offchainCosts={offchainCosts}
              marketData={marketData}
            />
          </TabsContent>

          {/* Time-Based Analysis Tab */}
          <TabsContent value="timing" className="space-y-6">
            <TimeBasedAnalysis marketData={marketData} />
          </TabsContent>

          {/* Scenario Builder Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <ScenarioBuilder marketData={marketData} />
          </TabsContent>

          {/* PDF Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <PDFExport 
              comparisonData={comparisonData}
              marketData={marketData}
              offchainCosts={offchainCosts}
            />
          </TabsContent>

          {/* Gas Price Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <GasPriceAlerts currentGasPrice={marketData.gasPrice} />
          </TabsContent>

          {/* Share Analysis Tab */}
          <TabsContent value="share" className="space-y-6">
            <ShareAnalysis 
              transactions={transactionData.map(tx => ({
                timestamp: tx.timestamp,
                txHash: tx.txHash,
                gasUsed: tx.gasUsed,
                gasPriceGwei: tx.gasPriceGwei,
                feeEth: tx.feeETH,
                feeRp: tx.feeIDR
              }))}
              bankFee={offchainCosts.bankTransferFee}
              otaCommission={offchainCosts.otaCommissionPercent}
              adminFee={offchainCosts.adminFee}
              baseAmount={offchainCosts.baseTransactionAmount}
            />
          </TabsContent>

          {/* Developer API Tab */}
          <TabsContent value="api" className="space-y-6">
            <DeveloperAPI />
          </TabsContent>

          {/* Transaction Simulator Tab */}
          <TabsContent value="simulate" className="space-y-6">
            <TransactionSimulator />
          </TabsContent>

          {/* Regional Comparison Tab */}
          <TabsContent value="regional" className="space-y-6">
            <RegionalComparison />
          </TabsContent>

          {/* Carbon Footprint Tab */}
          <TabsContent value="carbon" className="space-y-6">
            <CarbonFootprint 
              transactions={transactionData.map(tx => ({
                timestamp: tx.timestamp,
                txHash: tx.txHash,
                gasUsed: tx.gasUsed,
                gasPriceGwei: tx.gasPriceGwei,
                feeEth: tx.feeETH,
                feeRp: tx.feeIDR
              }))}
            />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <AboutSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}