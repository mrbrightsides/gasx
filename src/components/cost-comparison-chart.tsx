'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ComparisonData {
  timestamp: string
  txHash: string
  feeIDR: number
  offchainTotal: number
  isOnchainCheaper: boolean
  savings: number
  savingsPercent: string
}

interface CostComparisonChartProps {
  data: ComparisonData[]
}

export function CostComparisonChart({ data }: CostComparisonChartProps) {
  const chartData = data.map((item, index) => ({
    transaction: `Tx ${index + 1}`,
    txHash: item.txHash.slice(0, 8) + '...',
    onChain: Math.round(item.feeIDR),
    offChain: Math.round(item.offchainTotal),
    savings: Math.round(item.savings),
    isOnchainCheaper: item.isOnchainCheaper
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600 mb-2">Hash: {data.txHash}</p>
          <p className="text-blue-600">
            On-chain: Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
          <p className="text-orange-600">
            Off-chain: Rp {payload[1].value.toLocaleString('id-ID')}
          </p>
          <p className={`font-medium ${data.isOnchainCheaper ? 'text-green-600' : 'text-red-600'}`}>
            {data.isOnchainCheaper ? 'On-chain Cheaper' : 'Off-chain Cheaper'} by Rp {data.savings.toLocaleString('id-ID')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="transaction" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="onChain" 
            fill="#3b82f6" 
            name="On-chain (Gas Fee)" 
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="offChain" 
            fill="#f97316" 
            name="Off-chain (Total Cost)" 
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}