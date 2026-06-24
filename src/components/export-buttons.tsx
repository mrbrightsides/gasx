'use client'

import { Button } from '@/components/ui/button'
import { Download, FileImage } from 'lucide-react'

interface ComparisonData {
  timestamp: string
  txHash: string
  gasUsed: number
  gasPriceGwei: number
  feeIDR: number
  bankFee: number
  otaCommission: number
  adminFee: number
  offchainTotal: number
  isOnchainCheaper: boolean
  savings: number
  savingsPercent: string
}

interface ExportButtonsProps {
  data: ComparisonData[]
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const exportToCSV = (): void => {
    const headers = [
      'Timestamp',
      'Tx Hash',
      'Gas Used',
      'Gas Price (Gwei)',
      'On-chain Fee (IDR)',
      'Bank Transfer Fee (IDR)',
      'OTA Commission (IDR)',
      'Admin Fee (IDR)',
      'Off-chain Total (IDR)',
      'Cheaper Option',
      'Savings (IDR)',
      'Savings (%)',
      'Comparison Result'
    ]

    const csvData = data.map(item => [
      item.timestamp,
      item.txHash,
      item.gasUsed,
      item.gasPriceGwei,
      Math.round(item.feeIDR),
      Math.round(item.bankFee),
      Math.round(item.otaCommission),
      Math.round(item.adminFee),
      Math.round(item.offchainTotal),
      item.isOnchainCheaper ? 'On-chain' : 'Off-chain',
      Math.round(item.savings),
      item.savingsPercent,
      item.isOnchainCheaper ? 'On-chain Cheaper' : 'Off-chain Cheaper'
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `stc-gasx-comparison-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const exportChartsToPNG = async (): Promise<void> => {
    try {
      // This would typically use html2canvas or similar library
      // For now, we'll show a simple alert
      alert('Chart export functionality would be implemented here using html2canvas or similar library. This would capture the current charts as PNG images.')
      
      // Example implementation with html2canvas:
      /*
      const html2canvas = await import('html2canvas')
      
      const charts = document.querySelectorAll('[data-chart]')
      
      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i] as HTMLElement
        const canvas = await html2canvas.default(chart)
        const link = document.createElement('a')
        link.download = `stc-gasx-chart-${i + 1}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
      */
    } catch (error) {
      console.error('Failed to export charts:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportToCSV}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={exportChartsToPNG}
        className="flex items-center gap-2"
      >
        <FileImage className="h-4 w-4" />
        Export Charts
      </Button>
    </div>
  )
}