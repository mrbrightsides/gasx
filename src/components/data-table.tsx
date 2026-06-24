'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

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

interface DataTableProps {
  data: ComparisonData[]
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="font-semibold">Time</TableHead>
              <TableHead className="font-semibold">Transaction Hash</TableHead>
              <TableHead className="font-semibold text-right">Gas Used</TableHead>
              <TableHead className="font-semibold text-right">Gas Price (Gwei)</TableHead>
              <TableHead className="font-semibold text-right">On-chain Fee (IDR)</TableHead>
              <TableHead className="font-semibold text-right">Off-chain Total (IDR)</TableHead>
              <TableHead className="font-semibold text-right">Savings</TableHead>
              <TableHead className="font-semibold text-center">Cheaper Option</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">
                  {format(new Date(item.timestamp), 'HH:mm:ss')}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <span className="text-blue-600">
                    {item.txHash.slice(0, 10)}...
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.gasUsed.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.gasPriceGwei}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-blue-600">
                  {Math.round(item.feeIDR).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-orange-600">
                  {Math.round(item.offchainTotal).toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">
                  <span className={item.isOnchainCheaper ? 'text-green-600' : 'text-red-600'}>
                    {Math.round(item.savings).toLocaleString('id-ID')} ({item.savingsPercent}%)
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={item.isOnchainCheaper ? 'default' : 'secondary'}
                    className={
                      item.isOnchainCheaper 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                    }
                  >
                    {item.isOnchainCheaper ? 'On-chain' : 'Off-chain'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}