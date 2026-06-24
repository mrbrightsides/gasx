'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface RecommendationProps {
  comparisonData: Array<{
    feeIDR: number
    offchainTotal: number
    isOnchainCheaper: boolean
    savings: number
    savingsPercent: string
    timestamp: string
  }>
  offchainCosts: {
    bankTransferFee: number
    otaCommissionPercent: number
    adminFee: number
    baseTransactionAmount: number
  }
  marketData: {
    gasPrice: number
    ethToUSD: number
    usdToIDR: number
  }
}

export function SmartRecommendations({ comparisonData, offchainCosts, marketData }: RecommendationProps) {
  // Calculate statistics
  const avgOnchain = comparisonData.reduce((sum, item) => sum + item.feeIDR, 0) / comparisonData.length
  const avgOffchain = comparisonData.reduce((sum, item) => sum + item.offchainTotal, 0) / comparisonData.length
  const onchainCheaperCount = comparisonData.filter(item => item.isOnchainCheaper).length
  const onchainCheaperPercent = (onchainCheaperCount / comparisonData.length) * 100
  const avgSavings = comparisonData.reduce((sum, item) => sum + item.savings, 0) / comparisonData.length
  const totalVolume = offchainCosts.baseTransactionAmount * comparisonData.length

  // Generate smart recommendations
  const recommendations = []

  // 1. Volume-based recommendation
  if (totalVolume > 10000000) { // > 10 juta
    if (avgOnchain < avgOffchain) {
      recommendations.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Volume Tinggi: Blockchain Lebih Menguntungkan',
        description: `Dengan volume transaksi Rp ${totalVolume.toLocaleString('id-ID')}, blockchain ${((1 - avgOnchain / avgOffchain) * 100).toFixed(1)}% lebih hemat. Hemat hingga Rp ${((avgOffchain - avgOnchain) * comparisonData.length).toLocaleString('id-ID', { maximumFractionDigits: 0 })} untuk semua transaksi!`,
        priority: 'high'
      })
    } else {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Volume Tinggi dengan Biaya Gas Tinggi',
        description: `Gas fees saat ini membuat blockchain ${((avgOnchain / avgOffchain - 1) * 100).toFixed(1)}% lebih mahal. Pertimbangkan Layer 2 (Base, Polygon) atau tunggu gas lebih murah.`,
        priority: 'high'
      })
    }
  } else if (totalVolume > 1000000) { // > 1 juta
    recommendations.push({
      type: 'info',
      icon: Info,
      title: 'Volume Menengah: Pertimbangkan Biaya OTA',
      description: `OTA commission (${offchainCosts.otaCommissionPercent}%) = Rp ${((offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent) / 100).toLocaleString('id-ID', { maximumFractionDigits: 0 })} per transaksi. Blockchain bisa lebih hemat jika OTA > 15%.`,
      priority: 'medium'
    })
  }

  // 2. Transaction amount threshold recommendation
  const breakEvenAmount = (avgOnchain / offchainCosts.otaCommissionPercent) * 100
  if (breakEvenAmount > 0) {
    if (offchainCosts.baseTransactionAmount > breakEvenAmount) {
      recommendations.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Sweet Spot: Transaksi Besar Cocok untuk Blockchain',
        description: `Untuk transaksi > Rp ${breakEvenAmount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}, blockchain lebih menguntungkan karena biaya flat vs % commission.`,
        priority: 'high'
      })
    } else {
      recommendations.push({
        type: 'info',
        icon: TrendingDown,
        title: 'Transaksi Kecil: Off-chain Lebih Efisien',
        description: `Untuk transaksi < Rp ${breakEvenAmount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}, off-chain lebih murah. Break-even di ${breakEvenAmount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}.`,
        priority: 'medium'
      })
    }
  }

  // 3. Gas price recommendation
  if (marketData.gasPrice > 20) {
    recommendations.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Gas Price Tinggi Terdeteksi',
      description: `Gas saat ini ${marketData.gasPrice.toFixed(2)} Gwei (tinggi). Pertimbangkan menunggu jam off-peak (2-6 AM UTC) atau gunakan Layer 2 yang 70-90% lebih murah.`,
      priority: 'high'
    })
  } else if (marketData.gasPrice < 10) {
    recommendations.push({
      type: 'success',
      icon: CheckCircle,
      title: 'Waktu Optimal: Gas Price Rendah!',
      description: `Gas hanya ${marketData.gasPrice.toFixed(2)} Gwei - ini waktu yang bagus untuk transaksi on-chain! Manfaatkan sebelum gas naik lagi.`,
      priority: 'high'
    })
  }

  // 4. Success rate recommendation
  if (onchainCheaperPercent > 70) {
    recommendations.push({
      type: 'success',
      icon: CheckCircle,
      title: 'Konsistensi Tinggi: Blockchain Unggul',
      description: `${onchainCheaperPercent.toFixed(0)}% transaksi lebih murah di blockchain. Pertimbangkan migrasi penuh ke Web3 untuk hemat jangka panjang.`,
      priority: 'high'
    })
  } else if (onchainCheaperPercent < 30) {
    recommendations.push({
      type: 'info',
      icon: Info,
      title: 'Off-chain Lebih Konsisten Murah',
      description: `Hanya ${onchainCheaperPercent.toFixed(0)}% transaksi yang lebih murah di blockchain. Tetap di off-chain atau coba Layer 2 untuk biaya lebih rendah.`,
      priority: 'medium'
    })
  }

  // 5. OTA commission insight
  if (offchainCosts.otaCommissionPercent >= 20) {
    const potentialSavings = (offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent / 100) - avgOnchain
    if (potentialSavings > 0) {
      recommendations.push({
        type: 'success',
        icon: Lightbulb,
        title: 'OTA Commission Terlalu Tinggi!',
        description: `Commission ${offchainCosts.otaCommissionPercent}% = Rp ${(offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent / 100).toLocaleString('id-ID', { maximumFractionDigits: 0 })}. Blockchain bisa hemat Rp ${potentialSavings.toLocaleString('id-ID', { maximumFractionDigits: 0 })} per transaksi (${((potentialSavings / (offchainCosts.baseTransactionAmount * offchainCosts.otaCommissionPercent / 100)) * 100).toFixed(1)}% lebih murah)!`,
        priority: 'high'
      })
    }
  }

  // 6. Layer 2 suggestion
  if (avgOnchain > avgOffchain) {
    recommendations.push({
      type: 'info',
      icon: Lightbulb,
      title: 'Pertimbangkan Layer 2 Solution',
      description: `Ethereum mainnet lebih mahal. Cek tab Multi-Chain untuk membandingkan Base, Polygon, atau Arbitrum yang bisa 70-90% lebih murah dengan keamanan yang sama!`,
      priority: 'medium'
    })
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  recommendations.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder])

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-indigo-900/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500 dark:bg-purple-600">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Smart Recommendations</CardTitle>
            <CardDescription>
              AI-powered insights based on your transaction patterns and market conditions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-muted-foreground mb-1">Avg On-chain</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              Rp {avgOnchain.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-muted-foreground mb-1">Avg Off-chain</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              Rp {avgOffchain.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {onchainCheaperPercent.toFixed(0)}%
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-muted-foreground mb-1">Avg Savings</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              Rp {avgSavings.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => {
              const Icon = rec.icon
              const bgColors = {
                success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
                warning: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
                info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              }
              const iconColors = {
                success: 'text-green-600 dark:text-green-400',
                warning: 'text-orange-600 dark:text-orange-400',
                info: 'text-blue-600 dark:text-blue-400'
              }
              const priorityBadges = {
                high: <Badge className="bg-red-500 text-white">High Priority</Badge>,
                medium: <Badge className="bg-yellow-500 text-white">Medium</Badge>,
                low: <Badge className="bg-gray-500 text-white">Low</Badge>
              }

              return (
                <Alert key={index} className={`${bgColors[rec.type as keyof typeof bgColors]} border-2`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${iconColors[rec.type as keyof typeof iconColors]}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        {priorityBadges[rec.priority as keyof typeof priorityBadges]}
                      </div>
                      <AlertDescription className="text-sm">
                        {rec.description}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )
            })
          ) : (
            <Alert className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Upload lebih banyak data transaksi untuk mendapatkan rekomendasi yang lebih akurat.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Suggestions */}
        <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Action Items
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
              <span>Cek tab <strong>Multi-Chain</strong> untuk membandingkan biaya di berbagai blockchain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
              <span>Gunakan <strong>Time-Based Analysis</strong> untuk menemukan waktu optimal transaksi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
              <span>Ekspor hasil ke PDF untuk presentasi ke tim atau stakeholder</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
