'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, CheckCircle } from 'lucide-react'

interface TransactionData {
  timestamp: string
  txHash: string
  gasUsed: number
  gasPriceGwei: number
  feeETH: number
  feeIDR: number
}

interface CSVUploadProps {
  onDataUpload: (data: TransactionData[]) => void
}

export function CSVUpload({ onDataUpload }: CSVUploadProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (csvText: string): TransactionData[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    // Expected headers from STC Analytics export
    const expectedHeaders = ['Timestamp', 'Tx Hash', 'Gas Used', 'Gas Price (Gwei)', 'Fee (ETH)', 'Fee (Rp)']
    
    // Validate headers
    const hasRequiredHeaders = expectedHeaders.every(expected => 
      headers.some(header => header.toLowerCase().includes(expected.toLowerCase().replace(/[()]/g, '')))
    )
    
    if (!hasRequiredHeaders) {
      throw new Error(`CSV must contain columns: ${expectedHeaders.join(', ')}`)
    }

    // Find column indices
    const getColumnIndex = (searchTerms: string[]) => {
      return headers.findIndex(header => 
        searchTerms.some(term => header.toLowerCase().includes(term.toLowerCase()))
      )
    }

    const timestampIndex = getColumnIndex(['timestamp', 'time'])
    const txHashIndex = getColumnIndex(['tx hash', 'hash', 'transaction'])
    const gasUsedIndex = getColumnIndex(['gas used', 'gasused'])
    const gasPriceIndex = getColumnIndex(['gas price', 'gasprice', 'gwei'])
    const feeETHIndex = getColumnIndex(['fee eth', 'fee (eth)', 'estimated fee (eth)'])
    const feeIDRIndex = getColumnIndex(['fee rp', 'fee (rp)', 'estimated fee (rp)', 'rupiah'])

    const data: TransactionData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim())
      
      if (row.length < headers.length) continue // Skip incomplete rows
      
      try {
        const transaction: TransactionData = {
          timestamp: row[timestampIndex] || '',
          txHash: row[txHashIndex] || '',
          gasUsed: parseInt(row[gasUsedIndex]) || 0,
          gasPriceGwei: parseFloat(row[gasPriceIndex]) || 0,
          feeETH: parseFloat(row[feeETHIndex]) || 0,
          feeIDR: parseFloat(row[feeIDRIndex]) || 0
        }
        
        // Validate required fields
        if (transaction.txHash && transaction.gasUsed > 0 && transaction.feeIDR > 0) {
          data.push(transaction)
        }
      } catch (err) {
        console.warn(`Skipping invalid row ${i + 1}:`, err)
      }
    }
    
    return data
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setIsLoading(true)
    setError('')
    setUploadStatus('')

    try {
      const text = await file.text()
      const data = parseCSV(text)
      
      if (data.length === 0) {
        throw new Error('No valid transaction data found in CSV')
      }

      onDataUpload(data)
      setUploadStatus(`Successfully imported ${data.length} transactions`)
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadSample = (): void => {
    // Load sample data
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
    
    onDataUpload(sampleData)
    setUploadStatus(`Loaded ${sampleData.length} sample transactions`)
    setError('')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csvFile">Upload CSV File</Label>
          <div className="flex items-center gap-2">
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sample Data Button */}
        <div className="space-y-2">
          <Label>Or Use Sample Data</Label>
          <Button 
            variant="outline" 
            onClick={handleLoadSample}
            disabled={isLoading}
            className="w-full flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Load Sample Transactions
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{uploadStatus}</AlertDescription>
        </Alert>
      )}

      {/* CSV Format Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Expected CSV Format</h4>
        <p className="text-sm text-gray-600 mb-2">
          Your CSV should contain the following columns:
        </p>
        <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded border">
          Timestamp, Tx Hash, Gas Used, Gas Price (Gwei), Fee (ETH), Fee (Rp)
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This matches the export format from STC Analytics.
        </p>
      </div>
    </div>
  )
}