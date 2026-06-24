'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ComparisonData {
  feeIDR: number
  bankFee: number
  otaCommission: number
  adminFee: number
  offchainTotal: number
}

interface OffchainCosts {
  bankTransferFee: number
  otaCommissionPercent: number
  adminFee: number
}

interface FeeBreakdownChartProps {
  data: ComparisonData[]
  offchainCosts: OffchainCosts
}

export function FeeBreakdownChart({ data, offchainCosts }: FeeBreakdownChartProps) {
  // Safety check - ensure we have data
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground text-lg">No data available</div>
          <div className="text-sm text-muted-foreground">
            Import transaction data to see cost breakdown analysis
          </div>
        </div>
      </div>
    )
  }

  // Calculate averages safely
  const avgGasFee = data.reduce((sum, item) => sum + (item.feeIDR || 0), 0) / data.length
  const avgBankFee = offchainCosts.bankTransferFee || 0
  const avgOtaCommission = data.reduce((sum, item) => sum + (item.otaCommission || 0), 0) / data.length
  const avgAdminFee = offchainCosts.adminFee || 0

  // Calculate total for percentage calculations
  const total = avgGasFee + avgBankFee + avgOtaCommission + avgAdminFee

  // Safety check for total
  if (total <= 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-muted-foreground text-lg">Invalid cost data</div>
          <div className="text-sm text-muted-foreground">
            Please check your cost parameters and transaction data
          </div>
        </div>
      </div>
    )
  }

  const pieData = [
    {
      name: 'On-chain Gas Fee',
      value: Math.round(avgGasFee),
      color: '#3b82f6',
      percentage: ((avgGasFee / total) * 100).toFixed(1)
    },
    {
      name: 'Bank Transfer Fee',
      value: avgBankFee,
      color: '#f97316',
      percentage: ((avgBankFee / total) * 100).toFixed(1)
    },
    {
      name: 'OTA Commission',
      value: Math.round(avgOtaCommission),
      color: '#ef4444',
      percentage: ((avgOtaCommission / total) * 100).toFixed(1)
    },
    {
      name: 'Admin Fee',
      value: avgAdminFee,
      color: '#8b5cf6',
      percentage: ((avgAdminFee / total) * 100).toFixed(1)
    }
  ].filter(item => item.value > 0) // Remove zero values

  // Custom tooltip component with better dark mode support
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-lg font-medium" style={{ color: data.color }}>
            Rp {data.value.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.percentage}% of total cost
          </p>
        </div>
      )
    }
    return null
  }

  // Custom label component that handles positioning better
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    // Only show percentage labels if they're significant (>5%)
    if (parseFloat(percentage) < 5) return null

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={0.5}
      >
        {`${percentage}%`}
      </text>
    )
  }

  // Custom legend that shows both values and percentages
  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null
    
    return (
      <div className="flex flex-col space-y-2 ml-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {entry.value}: Rp {entry.payload.value.toLocaleString('id-ID')} ({entry.payload.percentage}%)
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full h-96 flex items-center">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                content={<CustomLegend />}
                verticalAlign="middle" 
                align="right" 
                layout="vertical"
                wrapperStyle={{ 
                  paddingLeft: '20px',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Gas Fee</div>
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            Rp {Math.round(avgGasFee).toLocaleString('id-ID')}
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
          <div className="text-sm font-medium text-orange-700 dark:text-orange-300">Bank Fee</div>
          <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
            Rp {avgBankFee.toLocaleString('id-ID')}
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
          <div className="text-sm font-medium text-red-700 dark:text-red-300">OTA Commission</div>
          <div className="text-lg font-bold text-red-900 dark:text-red-100">
            Rp {Math.round(avgOtaCommission).toLocaleString('id-ID')}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Admin Fee</div>
          <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
            Rp {avgAdminFee.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  )
}