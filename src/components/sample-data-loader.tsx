'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, ShoppingCart, Plane, Users, Wallet, Download } from 'lucide-react'
import { useState } from 'react'

interface TransactionData {
  timestamp: string
  txHash: string
  gasUsed: number
  gasPriceGwei: number
  feeETH: number
  feeIDR: number
}

interface SampleDataLoaderProps {
  onLoadData: (data: TransactionData[]) => void
  currentDataCount: number
}

interface SampleDataset {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  data: TransactionData[]
}

export function SampleDataLoader({ onLoadData, currentDataCount }: SampleDataLoaderProps) {
  const [selectedDataset, setSelectedDataset] = useState<string>('ecommerce')

  const sampleDatasets: SampleDataset[] = [
    {
      id: 'ecommerce',
      name: 'E-Commerce Checkout',
      description: 'Transaksi pembayaran e-commerce dengan berbagai nominal (Rp 100k - 5 juta)',
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'blue',
      data: [
        { timestamp: '2025-01-20 09:15:22', txHash: '0xecom001', gasUsed: 21000, gasPriceGwei: 18, feeETH: 0.000378, feeIDR: 8850 },
        { timestamp: '2025-01-20 09:28:45', txHash: '0xecom002', gasUsed: 65000, gasPriceGwei: 20, feeETH: 0.0013, feeIDR: 30450 },
        { timestamp: '2025-01-20 10:05:11', txHash: '0xecom003', gasUsed: 48000, gasPriceGwei: 16, feeETH: 0.000768, feeIDR: 18000 },
        { timestamp: '2025-01-20 10:42:33', txHash: '0xecom004', gasUsed: 21000, gasPriceGwei: 22, feeETH: 0.000462, feeIDR: 10830 },
        { timestamp: '2025-01-20 11:20:08', txHash: '0xecom005', gasUsed: 52000, gasPriceGwei: 19, feeETH: 0.000988, feeIDR: 23150 },
        { timestamp: '2025-01-20 12:15:44', txHash: '0xecom006', gasUsed: 35000, gasPriceGwei: 17, feeETH: 0.000595, feeIDR: 13950 },
        { timestamp: '2025-01-20 13:05:29', txHash: '0xecom007', gasUsed: 21000, gasPriceGwei: 21, feeETH: 0.000441, feeIDR: 10330 },
        { timestamp: '2025-01-20 14:30:16', txHash: '0xecom008', gasUsed: 45000, gasPriceGwei: 18, feeETH: 0.00081, feeIDR: 18990 },
        { timestamp: '2025-01-20 15:12:55', txHash: '0xecom009', gasUsed: 28000, gasPriceGwei: 16, feeETH: 0.000448, feeIDR: 10500 },
        { timestamp: '2025-01-20 16:45:20', txHash: '0xecom010', gasUsed: 55000, gasPriceGwei: 23, feeETH: 0.001265, feeIDR: 29650 },
      ]
    },
    {
      id: 'travel',
      name: 'Travel Booking',
      description: 'Booking hotel & tiket pesawat dengan komisi OTA 15-25% (Rp 500k - 10 juta)',
      icon: <Plane className="h-5 w-5" />,
      color: 'purple',
      data: [
        { timestamp: '2025-01-19 08:20:15', txHash: '0xtravel01', gasUsed: 85000, gasPriceGwei: 25, feeETH: 0.002125, feeIDR: 49800 },
        { timestamp: '2025-01-19 09:45:30', txHash: '0xtravel02', gasUsed: 90000, gasPriceGwei: 22, feeETH: 0.00198, feeIDR: 46400 },
        { timestamp: '2025-01-19 11:10:48', txHash: '0xtravel03', gasUsed: 78000, gasPriceGwei: 28, feeETH: 0.002184, feeIDR: 51200 },
        { timestamp: '2025-01-19 13:25:12', txHash: '0xtravel04', gasUsed: 95000, gasPriceGwei: 24, feeETH: 0.00228, feeIDR: 53450 },
        { timestamp: '2025-01-19 14:50:33', txHash: '0xtravel05', gasUsed: 82000, gasPriceGwei: 26, feeETH: 0.002132, feeIDR: 49950 },
        { timestamp: '2025-01-19 16:15:55', txHash: '0xtravel06', gasUsed: 88000, gasPriceGwei: 23, feeETH: 0.002024, feeIDR: 47450 },
        { timestamp: '2025-01-19 17:40:20', txHash: '0xtravel07', gasUsed: 92000, gasPriceGwei: 27, feeETH: 0.002484, feeIDR: 58200 },
        { timestamp: '2025-01-19 19:05:44', txHash: '0xtravel08', gasUsed: 86000, gasPriceGwei: 21, feeETH: 0.001806, feeIDR: 42350 },
      ]
    },
    {
      id: 'remittance',
      name: 'P2P Transfer / Remittance',
      description: 'Transfer antar individu, remitansi, atau payment peer-to-peer (Rp 50k - 2 juta)',
      icon: <Users className="h-5 w-5" />,
      color: 'green',
      data: [
        { timestamp: '2025-01-18 07:30:10', txHash: '0xp2p0001', gasUsed: 21000, gasPriceGwei: 14, feeETH: 0.000294, feeIDR: 6900 },
        { timestamp: '2025-01-18 08:15:25', txHash: '0xp2p0002', gasUsed: 21000, gasPriceGwei: 15, feeETH: 0.000315, feeIDR: 7400 },
        { timestamp: '2025-01-18 09:45:40', txHash: '0xp2p0003', gasUsed: 21000, gasPriceGwei: 16, feeETH: 0.000336, feeIDR: 7900 },
        { timestamp: '2025-01-18 11:20:55', txHash: '0xp2p0004', gasUsed: 21000, gasPriceGwei: 13, feeETH: 0.000273, feeIDR: 6400 },
        { timestamp: '2025-01-18 12:50:12', txHash: '0xp2p0005', gasUsed: 21000, gasPriceGwei: 17, feeETH: 0.000357, feeIDR: 8400 },
        { timestamp: '2025-01-18 14:25:30', txHash: '0xp2p0006', gasUsed: 21000, gasPriceGwei: 15, feeETH: 0.000315, feeIDR: 7400 },
        { timestamp: '2025-01-18 16:10:45', txHash: '0xp2p0007', gasUsed: 21000, gasPriceGwei: 18, feeETH: 0.000378, feeIDR: 8900 },
        { timestamp: '2025-01-18 17:55:22', txHash: '0xp2p0008', gasUsed: 21000, gasPriceGwei: 14, feeETH: 0.000294, feeIDR: 6900 },
        { timestamp: '2025-01-18 19:40:50', txHash: '0xp2p0009', gasUsed: 21000, gasPriceGwei: 16, feeETH: 0.000336, feeIDR: 7900 },
        { timestamp: '2025-01-18 21:15:33', txHash: '0xp2p0010', gasUsed: 21000, gasPriceGwei: 12, feeETH: 0.000252, feeIDR: 5900 },
      ]
    },
    {
      id: 'mixed',
      name: 'Mixed Transactions',
      description: 'Campuran berbagai jenis transaksi: simple transfer, token, swap, NFT',
      icon: <Wallet className="h-5 w-5" />,
      color: 'orange',
      data: [
        { timestamp: '2025-01-21 08:00:00', txHash: '0xmix001', gasUsed: 21000, gasPriceGwei: 15, feeETH: 0.000315, feeIDR: 7400 },
        { timestamp: '2025-01-21 08:30:00', txHash: '0xmix002', gasUsed: 65000, gasPriceGwei: 18, feeETH: 0.00117, feeIDR: 27450 },
        { timestamp: '2025-01-21 09:00:00', txHash: '0xmix003', gasUsed: 150000, gasPriceGwei: 22, feeETH: 0.0033, feeIDR: 77400 },
        { timestamp: '2025-01-21 09:30:00', txHash: '0xmix004', gasUsed: 85000, gasPriceGwei: 19, feeETH: 0.001615, feeIDR: 37900 },
        { timestamp: '2025-01-21 10:00:00', txHash: '0xmix005', gasUsed: 21000, gasPriceGwei: 16, feeETH: 0.000336, feeIDR: 7900 },
        { timestamp: '2025-01-21 10:30:00', txHash: '0xmix006', gasUsed: 45000, gasPriceGwei: 20, feeETH: 0.0009, feeIDR: 21100 },
        { timestamp: '2025-01-21 11:00:00', txHash: '0xmix007', gasUsed: 200000, gasPriceGwei: 25, feeETH: 0.005, feeIDR: 117300 },
        { timestamp: '2025-01-21 11:30:00', txHash: '0xmix008', gasUsed: 35000, gasPriceGwei: 17, feeETH: 0.000595, feeIDR: 13950 },
        { timestamp: '2025-01-21 12:00:00', txHash: '0xmix009', gasUsed: 75000, gasPriceGwei: 21, feeETH: 0.001575, feeIDR: 36950 },
        { timestamp: '2025-01-21 12:30:00', txHash: '0xmix010', gasUsed: 120000, gasPriceGwei: 23, feeETH: 0.00276, feeIDR: 64750 },
      ]
    }
  ]

  const currentDataset = sampleDatasets.find(d => d.id === selectedDataset)

  const handleLoadData = () => {
    if (currentDataset) {
      onLoadData(currentDataset.data)
    }
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Sample Dataset Scenarios
        </CardTitle>
        <CardDescription>
          Pilih dan muat dataset sample untuk berbagai skenario use case
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Dataset Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Pilih Skenario</p>
              <p className="text-xs text-muted-foreground">
                Data saat ini: {currentDataCount} transaksi
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
              4 Scenarios
            </Badge>
          </div>

          <Select value={selectedDataset} onValueChange={setSelectedDataset}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sampleDatasets.map(dataset => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  <div className="flex items-center gap-2">
                    {dataset.icon}
                    {dataset.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Dataset Info */}
        {currentDataset && (
          <Card className={`border-${currentDataset.color}-200 dark:border-${currentDataset.color}-800 bg-${currentDataset.color}-50 dark:bg-${currentDataset.color}-900/10`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-${currentDataset.color}-100 dark:bg-${currentDataset.color}-900/30`}>
                  {currentDataset.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{currentDataset.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {currentDataset.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <Badge variant="outline" className="bg-white dark:bg-gray-800">
                      {currentDataset.data.length} Transaksi
                    </Badge>
                    <span className="text-muted-foreground">
                      Gas: {Math.min(...currentDataset.data.map(d => d.gasPriceGwei))}-{Math.max(...currentDataset.data.map(d => d.gasPriceGwei))} Gwei
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Load Button */}
        <Button 
          onClick={handleLoadData}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          Muat Dataset: {currentDataset?.name}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <p className="font-semibold mb-1">💡 Cara Penggunaan:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Pilih skenario yang sesuai dengan use case Anda</li>
            <li>Klik "Muat Dataset" untuk replace data saat ini</li>
            <li>Lihat hasil analisis di tab Dashboard, Trends, dan Breakdown</li>
            <li>Sesuaikan parameter off-chain sesuai kebutuhan</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
