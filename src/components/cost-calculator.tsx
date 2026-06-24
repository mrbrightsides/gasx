'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, TrendingDown, TrendingUp, Zap, DollarSign } from 'lucide-react'

interface CostCalculatorProps {
  marketData: {
    ethToUSD: number
    usdToIDR: number
    gasPrice: number
  }
  offchainCosts: {
    bankTransferFee: number
    otaCommissionPercent: number
    adminFee: number
  }
}

export function CostCalculator({ marketData, offchainCosts }: CostCalculatorProps) {
  const [amount, setAmount] = useState<string>('500000')
  const [transactionType, setTransactionType] = useState<string>('simple')
  const [gasLimit, setGasLimit] = useState<number>(21000)
  
  // Calculate on-chain cost
  const calculateOnchainCost = () => {
    if (!marketData.gasPrice || !marketData.ethToUSD || !marketData.usdToIDR) {
      return 0
    }
    const gasCostETH = (gasLimit * marketData.gasPrice) / 1000000000
    const gasCostUSD = gasCostETH * marketData.ethToUSD
    const gasCostIDR = gasCostUSD * marketData.usdToIDR
    return gasCostIDR
  }

  // Calculate off-chain cost
  const calculateOffchainCost = () => {
    const baseAmount = parseFloat(amount) || 0
    const bankFee = offchainCosts.bankTransferFee
    const otaCommission = (baseAmount * offchainCosts.otaCommissionPercent) / 100
    const adminFee = offchainCosts.adminFee
    return {
      bankFee,
      otaCommission,
      adminFee,
      total: bankFee + otaCommission + adminFee
    }
  }

  // Update gas limit based on transaction type
  useEffect(() => {
    const gasLimits: Record<string, number> = {
      simple: 21000,      // Simple transfer
      token: 65000,       // ERC-20 token transfer
      swap: 150000,       // DEX swap
      nft: 85000,         // NFT mint/transfer
      complex: 200000     // Complex contract interaction
    }
    setGasLimit(gasLimits[transactionType] || 21000)
  }, [transactionType])

  const onchainCost = calculateOnchainCost()
  const offchainCost = calculateOffchainCost()
  const savings = Math.abs(onchainCost - offchainCost.total)
  const savingsPercent = offchainCost.total > 0 ? ((savings / Math.max(onchainCost, offchainCost.total)) * 100).toFixed(1) : '0'
  const isOnchainCheaper = onchainCost < offchainCost.total

  return (
    <div className="space-y-6">
      {/* Calculator Form */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Kalkulator Biaya Transaksi
          </CardTitle>
          <CardDescription>
            Hitung dan bandingkan biaya on-chain vs off-chain untuk transaksi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Jumlah Transaksi (IDR)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  placeholder="500000"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan nominal transaksi dalam Rupiah
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="txType">Jenis Transaksi Blockchain</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger id="txType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Transfer Sederhana (21k gas)</SelectItem>
                    <SelectItem value="token">Transfer Token ERC-20 (65k gas)</SelectItem>
                    <SelectItem value="swap">DEX Swap (150k gas)</SelectItem>
                    <SelectItem value="nft">NFT Mint/Transfer (85k gas)</SelectItem>
                    <SelectItem value="complex">Kontrak Kompleks (200k gas)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Gas Limit: {gasLimit.toLocaleString('id-ID')} units
                </p>
              </div>
            </div>

            {/* Right Column - Live Calculation */}
            <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-300">
                Perhitungan Real-time
              </h3>
              
              {/* On-chain Cost */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Biaya On-chain (Gas Fee)</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Rp {onchainCost.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((gasLimit * marketData.gasPrice) / 1000000000).toFixed(8)} ETH
                </p>
              </div>

              <Separator />

              {/* Off-chain Cost */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Biaya Off-chain (Total)</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  Rp {offchainCost.total.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>• Transfer Bank: Rp {offchainCost.bankFee.toLocaleString('id-ID')}</p>
                  <p>• Komisi OTA ({offchainCosts.otaCommissionPercent}%): Rp {offchainCost.otaCommission.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  <p>• Biaya Admin: Rp {offchainCost.adminFee.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Card */}
      <Card className={`border-2 ${isOnchainCheaper ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10' : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isOnchainCheaper ? (
                <TrendingDown className="h-12 w-12 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingUp className="h-12 w-12 text-red-600 dark:text-red-400" />
              )}
              <div>
                <h3 className="text-2xl font-bold">
                  {isOnchainCheaper ? 'On-chain Lebih Hemat!' : 'Off-chain Lebih Hemat!'}
                </h3>
                <p className="text-muted-foreground">
                  Selisih: Rp {savings.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({savingsPercent}%)
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 ${isOnchainCheaper ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700'}`}
              >
                {isOnchainCheaper ? '✓ Gunakan Blockchain' : '✓ Gunakan Metode Tradisional'}
              </Badge>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-sm mb-2">💡 Insight:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {isOnchainCheaper ? (
                <>
                  <li>• Blockchain lebih hemat <strong>Rp {savings.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> untuk transaksi ini</li>
                  <li>• Tidak ada komisi OTA pada transaksi on-chain</li>
                  <li>• Transaksi langsung peer-to-peer tanpa intermediary</li>
                </>
              ) : (
                <>
                  <li>• Metode tradisional lebih hemat <strong>Rp {savings.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong> untuk saat ini</li>
                  <li>• Gas price sedang tinggi: {marketData.gasPrice.toFixed(2)} Gwei</li>
                  <li>• Pertimbangkan transaksi saat gas price lebih rendah</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Perhitungan ini menggunakan data real-time dari gas price Ethereum Sepolia, 
            harga ETH dari CoinGecko, dan kurs USD-IDR dari Frankfurter API. Biaya off-chain dapat disesuaikan 
            di tab Dashboard sesuai dengan provider layanan Anda.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
