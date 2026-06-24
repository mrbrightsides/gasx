'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface ComparisonData {
  timestamp: string
  txHash: string
  feeIDR: number
  offchainTotal: number
  gasPriceGwei: number
}

interface GasTrendChartProps {
  data: ComparisonData[]
}

export function GasTrendChart({ data }: GasTrendChartProps) {
  const chartData = data.map((item, index) => {
    const date = new Date(item.timestamp)
    return {
      time: format(date, 'HH:mm'),
      timestamp: item.timestamp,
      gasFeeIDR: Math.round(item.feeIDR),
      offchainCost: Math.round(item.offchainTotal),
      gasPriceGwei: item.gasPriceGwei,
      transaction: `Tx ${index + 1}`
    }
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">Time: {label}</p>
          <p className="text-sm text-gray-600 mb-2">{data.transaction}</p>
          <p className="text-blue-600">
            Gas Fee: Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
          <p className="text-orange-600">
            Off-chain: Rp {payload[1].value.toLocaleString('id-ID')}
          </p>
          <p className="text-gray-600 text-sm">
            Gas Price: {data.gasPriceGwei} Gwei
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time" 
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
          <Line 
            type="monotone" 
            dataKey="gasFeeIDR" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#3b82f6' }}
            name="Gas Fee (IDR)"
          />
          <Line 
            type="monotone" 
            dataKey="offchainCost" 
            stroke="#f97316" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 5, fill: '#f97316' }}
            name="Off-chain Cost (IDR)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}