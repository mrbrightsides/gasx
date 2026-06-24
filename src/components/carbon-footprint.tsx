'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, Zap, Cloud, TreePine, Factory, Lightbulb } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Transaction {
  timestamp: string;
  txHash: string;
  gasUsed: number;
  gasPriceGwei: number;
  feeEth: number;
  feeRp: number;
}

interface CarbonFootprintProps {
  transactions: Transaction[];
}

export function CarbonFootprint({ transactions }: CarbonFootprintProps) {
  // Carbon emission factors (kg CO2 per transaction)
  const emissionFactors = {
    ethereum: 0.0085, // Post-merge Ethereum (Proof of Stake)
    bitcoin: 200, // Bitcoin (for comparison)
    visa: 0.000045, // Traditional payment
    mastercard: 0.000042,
    bankTransfer: 0.0015, // Traditional bank transfer
    dataCenter: 0.002, // Traditional server processing
  };

  // Calculate carbon footprint
  const calculateCarbonFootprint = () => {
    const totalTransactions = transactions.length;
    
    // Ethereum (blockchain) emissions
    const ethereumEmissions = totalTransactions * emissionFactors.ethereum;
    
    // Traditional banking emissions (bank transfer + card processing + data center)
    const traditionalEmissions = totalTransactions * (
      emissionFactors.bankTransfer + 
      emissionFactors.visa +
      emissionFactors.dataCenter
    );
    
    // Bitcoin comparison (to show how efficient Ethereum PoS is)
    const bitcoinEmissions = totalTransactions * emissionFactors.bitcoin;
    
    return {
      ethereum: ethereumEmissions,
      traditional: traditionalEmissions,
      bitcoin: bitcoinEmissions,
      difference: traditionalEmissions - ethereumEmissions,
      percentDifference: ((Math.abs(traditionalEmissions - ethereumEmissions) / traditionalEmissions) * 100).toFixed(1),
    };
  };

  const carbon = calculateCarbonFootprint();

  // Equivalent comparisons
  const equivalents = {
    treeMonths: (carbon.ethereum / 0.021).toFixed(1), // Trees needed for 1 month to offset
    carKm: (carbon.ethereum / 0.12).toFixed(1), // Equivalent km driven by car
    lightbulbHours: (carbon.ethereum / 0.0006).toFixed(0), // LED bulb hours
    phoneCharges: (carbon.ethereum / 0.000008).toFixed(0), // Smartphone full charges
  };

  const comparisonData = [
    { name: 'Ethereum (PoS)', value: carbon.ethereum, color: '#3b82f6' },
    { name: 'Traditional Banking', value: carbon.traditional, color: '#10b981' },
    { name: 'Bitcoin (PoW)', value: carbon.bitcoin, color: '#ef4444' },
  ];

  const methodologyData = [
    {
      category: 'Blockchain Transaction',
      emissions: carbon.ethereum,
      color: '#3b82f6',
    },
    {
      category: 'Traditional Payment',
      emissions: carbon.traditional,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-emerald-500 dark:bg-emerald-600">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                Carbon Footprint Analysis
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Environmental impact: Blockchain vs Traditional Banking
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Ethereum (PoS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {carbon.ethereum.toFixed(4)} kg
              </p>
              <p className="text-xs text-muted-foreground">
                CO₂ for {transactions.length} transactions
              </p>
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Proof of Stake
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Factory className="h-4 w-4 text-green-600 dark:text-green-400" />
              Traditional Banking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {carbon.traditional.toFixed(4)} kg
              </p>
              <p className="text-xs text-muted-foreground">
                CO₂ for {transactions.length} payments
              </p>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                Cards + Banks
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.abs(carbon.difference).toFixed(4)} kg
              </p>
              <p className="text-xs text-muted-foreground">
                {carbon.difference > 0 ? 'Less' : 'More'} than traditional
              </p>
              <Badge variant="default" className="bg-emerald-500">
                {carbon.percentDifference}% difference
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Carbon Emissions Comparison</CardTitle>
          <CardDescription>
            CO₂ emissions per {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodologyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="category" className="text-xs" />
                <YAxis className="text-xs" label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(4)} kg CO₂`, 'Emissions']}
                />
                <Bar dataKey="emissions" radius={[8, 8, 0, 0]}>
                  {methodologyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Real-World Equivalents */}
      <Card>
        <CardHeader>
          <CardTitle>Real-World Equivalents</CardTitle>
          <CardDescription>
            What does {carbon.ethereum.toFixed(4)} kg CO₂ mean in everyday terms?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Trees Needed (1 month)</p>
                  <Badge variant="outline">{equivalents.treeMonths} trees</Badge>
                </div>
                <Progress value={25} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  To offset these emissions in one month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Car Driving Distance</p>
                  <Badge variant="outline">{equivalents.carKm} km</Badge>
                </div>
                <Progress value={35} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Equivalent kilometers driven by average car
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
                <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">LED Bulb Hours</p>
                  <Badge variant="outline">{equivalents.lightbulbHours} hours</Badge>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Hours of 10W LED bulb usage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Smartphone Charges</p>
                  <Badge variant="outline">{equivalents.phoneCharges} charges</Badge>
                </div>
                <Progress value={55} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Full charges of modern smartphone
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              ✅
            </Badge>
            <p className="text-sm">
              <strong>Ethereum's Proof of Stake</strong> reduced energy consumption by ~99.95% compared to Proof of Work, making it one of the most energy-efficient blockchain networks.
            </p>
          </div>

          <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              📊
            </Badge>
            <p className="text-sm">
              <strong>Traditional Banking</strong> has hidden environmental costs including physical infrastructure (ATMs, branches), paper statements, and centralized data centers.
            </p>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              🌱
            </Badge>
            <p className="text-sm">
              <strong>Layer 2 Solutions</strong> (Base, Arbitrum, Optimism) have even lower carbon footprints while maintaining security, making them excellent choices for frequent transactions.
            </p>
          </div>

          <div className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              💡
            </Badge>
            <p className="text-sm">
              <strong>Total Impact</strong> depends on transaction volume. For high-volume use cases, blockchain's consistent low-per-transaction footprint becomes increasingly advantageous.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Methodology</CardTitle>
          <CardDescription>
            How we calculate carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Our carbon footprint calculations are based on peer-reviewed research and industry standards:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>
              <strong>Ethereum (PoS):</strong> 0.0085 kg CO₂ per transaction (post-merge estimate)
            </li>
            <li>
              <strong>Bank Transfer:</strong> 0.0015 kg CO₂ per transaction
            </li>
            <li>
              <strong>Card Payment:</strong> 0.000045 kg CO₂ per transaction (Visa/Mastercard average)
            </li>
            <li>
              <strong>Data Center:</strong> 0.002 kg CO₂ per transaction processing
            </li>
          </ul>

          <p className="text-xs text-muted-foreground mt-4">
            Sources: Ethereum Foundation, Visa Sustainability Report, Mastercard Carbon Calculator, 
            Cambridge Bitcoin Electricity Consumption Index
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
