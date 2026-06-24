'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileDown, Loader2, CheckCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface PDFExportProps {
  comparisonData: Array<{
    timestamp: string
    txHash: string
    feeIDR: number
    offchainTotal: number
    isOnchainCheaper: boolean
    savings: number
    savingsPercent: string
    bankFee: number
    otaCommission: number
    adminFee: number
  }>
  marketData: {
    ethToUSD: number
    usdToIDR: number
    gasPrice: number
    lastUpdated: string
  }
  offchainCosts: {
    bankTransferFee: number
    otaCommissionPercent: number
    adminFee: number
    baseTransactionAmount: number
  }
}

export function PDFExport({ comparisonData, marketData, offchainCosts }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    toast.info('Generating PDF report...')

    try {
      // Dynamic imports to reduce initial bundle size
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      let yPos = margin

      // Helper function to add new page if needed
      const checkPageBreak = (neededSpace: number) => {
        if (yPos + neededSpace > pageHeight - margin) {
          doc.addPage()
          yPos = margin
          return true
        }
        return false
      }

      // Title Page
      doc.setFillColor(139, 92, 246) // Purple
      doc.rect(0, 0, pageWidth, 60, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('STC GasX', pageWidth / 2, 25, { align: 'center' })
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.text('Web3 Cost Comparison Report', pageWidth / 2, 35, { align: 'center' })
      
      doc.setFontSize(10)
      doc.text(new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }), pageWidth / 2, 45, { align: 'center' })

      yPos = 70

      // Executive Summary
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Executive Summary', margin, yPos)
      yPos += 10

      const avgOnchain = comparisonData.reduce((sum, item) => sum + item.feeIDR, 0) / comparisonData.length
      const avgOffchain = comparisonData.reduce((sum, item) => sum + item.offchainTotal, 0) / comparisonData.length
      const onchainCheaperCount = comparisonData.filter(item => item.isOnchainCheaper).length
      const totalSavings = comparisonData.reduce((sum, item) => sum + item.savings, 0)
      const isOnchainCheaper = avgOnchain < avgOffchain
      const savingsPercent = ((Math.abs(avgOnchain - avgOffchain) / Math.max(avgOnchain, avgOffchain)) * 100).toFixed(1)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const summaryText = [
        `This report analyzes ${comparisonData.length} transactions, comparing on-chain (blockchain) `,
        `gas fees with traditional off-chain payment costs. The analysis provides data-driven `,
        `insights for decision-making regarding Web3 adoption.`,
        '',
        `Key Findings:`,
        `• Average On-chain Cost: Rp ${avgOnchain.toLocaleString('id-ID', { maximumFractionDigits: 0 })} per transaction`,
        `• Average Off-chain Cost: Rp ${avgOffchain.toLocaleString('id-ID', { maximumFractionDigits: 0 })} per transaction`,
        `• On-chain Cheaper: ${onchainCheaperCount} out of ${comparisonData.length} transactions (${((onchainCheaperCount/comparisonData.length)*100).toFixed(1)}%)`,
        `• ${isOnchainCheaper ? 'Blockchain is ' + savingsPercent + '% cheaper on average' : 'Off-chain is ' + savingsPercent + '% cheaper on average'}`,
        `• Total Potential Savings: Rp ${Math.abs(totalSavings).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`
      ]

      summaryText.forEach(line => {
        checkPageBreak(7)
        doc.text(line, margin, yPos)
        yPos += 5
      })

      yPos += 5

      // Market Conditions
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Market Conditions', margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const marketText = [
        `Analysis Date: ${new Date(marketData.lastUpdated).toLocaleString('id-ID')}`,
        `ETH Price: $${marketData.ethToUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`,
        `USD to IDR: Rp ${marketData.usdToIDR.toLocaleString('id-ID', { maximumFractionDigits: 2 })}`,
        `Current Gas Price: ${marketData.gasPrice.toFixed(8)} Gwei`,
        '',
        `Off-chain Cost Parameters:`,
        `• Bank Transfer Fee: Rp ${offchainCosts.bankTransferFee.toLocaleString('id-ID')}`,
        `• OTA Commission: ${offchainCosts.otaCommissionPercent}% of transaction`,
        `• Base Transaction Amount: Rp ${offchainCosts.baseTransactionAmount.toLocaleString('id-ID')}`,
        `• Admin Fee: Rp ${offchainCosts.adminFee.toLocaleString('id-ID')}`
      ]

      marketText.forEach(line => {
        checkPageBreak(7)
        doc.text(line, margin, yPos)
        yPos += 5
      })

      yPos += 5

      // Methodology
      checkPageBreak(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Methodology', margin, yPos)
      yPos += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const methodologyText = [
        `Data Collection:`,
        `• Transaction data sourced from STC Analytics platform`,
        `• Real-time market data from CoinGecko (ETH/USD) and Frankfurter (USD/IDR)`,
        `• Gas prices fetched from Infura Sepolia testnet`,
        '',
        `Cost Calculation:`,
        `• On-chain: Gas Used × Gas Price × ETH/USD × USD/IDR`,
        `• Off-chain: Bank Fee + (Base Amount × OTA %) + Admin Fee`,
        '',
        `Comparison Metrics:`,
        `• Per-transaction cost analysis`,
        `• Aggregate savings calculation`,
        `• Success rate (% of transactions where blockchain is cheaper)`,
        `• Percentage difference between methods`
      ]

      methodologyText.forEach(line => {
        checkPageBreak(7)
        doc.text(line, margin, yPos)
        yPos += 5
      })

      // New page for detailed data
      doc.addPage()
      yPos = margin

      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Detailed Transaction Analysis', margin, yPos)
      yPos += 10

      // Table Header
      doc.setFillColor(139, 92, 246)
      doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      
      const colWidths = [25, 30, 30, 25, 25, 35]
      const headers = ['Timestamp', 'On-chain (Rp)', 'Off-chain (Rp)', 'Savings (Rp)', 'Savings %', 'Cheaper Method']
      let xPos = margin + 2
      
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos)
        xPos += colWidths[i]
      })
      yPos += 8

      // Table Rows
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      
      comparisonData.slice(0, 25).forEach((row, index) => {
        if (checkPageBreak(8)) {
          // Repeat header on new page
          doc.setFillColor(139, 92, 246)
          doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFont('helvetica', 'bold')
          xPos = margin + 2
          headers.forEach((header, i) => {
            doc.text(header, xPos, yPos)
            xPos += colWidths[i]
          })
          yPos += 8
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'normal')
        }

        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251)
          doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 7, 'F')
        }

        xPos = margin + 2
        const rowData = [
          new Date(row.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
          row.feeIDR.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
          row.offchainTotal.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
          row.savings.toLocaleString('id-ID', { maximumFractionDigits: 0 }),
          row.savingsPercent + '%',
          row.isOnchainCheaper ? 'On-chain' : 'Off-chain'
        ]

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPos)
          xPos += colWidths[i]
        })
        yPos += 7
      })

      if (comparisonData.length > 25) {
        yPos += 5
        doc.setFont('helvetica', 'italic')
        doc.text(`... and ${comparisonData.length - 25} more transactions`, margin, yPos)
      }

      // Footer on last page
      doc.setFontSize(8)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(128, 128, 128)
      doc.text(
        'Generated by STC GasX - Web3 Cost Comparator | https://github.com/mrbrightsides',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )

      // Save PDF
      const fileName = `STC-GasX-Report-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

      toast.success('PDF report generated successfully!')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-900 dark:to-purple-900/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500 dark:bg-indigo-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">PDF Report Export</CardTitle>
            <CardDescription>
              Generate comprehensive academic-ready PDF report with all analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Report Contents
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">✓</span>
              <span><strong>Executive Summary</strong> - Key findings and recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">✓</span>
              <span><strong>Market Conditions</strong> - Current ETH price, gas price, exchange rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">✓</span>
              <span><strong>Methodology</strong> - Data sources and calculation methods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">✓</span>
              <span><strong>Detailed Analysis</strong> - Transaction-by-transaction breakdown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">✓</span>
              <span><strong>Formatted Tables</strong> - Professional data presentation</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
          <div>
            <p className="text-sm font-medium">Ready to export</p>
            <p className="text-xs text-muted-foreground mt-1">
              {comparisonData.length} transactions analyzed
            </p>
          </div>
          <Button
            onClick={generatePDF}
            disabled={isGenerating || comparisonData.length === 0}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Generate PDF Report
              </>
            )}
          </Button>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-muted-foreground">
            <strong>💡 Tip:</strong> PDF reports are perfect for academic submissions, business presentations, 
            and stakeholder reviews. The report includes professional formatting and comprehensive analysis 
            suitable for research documentation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
