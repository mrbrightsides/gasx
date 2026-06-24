'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Zap, TrendingUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface SimulationResult {
  success: boolean;
  estimatedGas: number;
  gasPrice: number;
  totalCostEth: number;
  totalCostUsd: number;
  totalCostIdr: number;
  executionTime: number;
  blockNumber?: number;
  transactionHash?: string;
}

export function TransactionSimulator() {
  const [chain, setChain] = useState<string>('ethereum');
  const [transactionType, setTransactionType] = useState<string>('transfer');
  const [amount, setAmount] = useState<string>('0.1');
  const [toAddress, setToAddress] = useState<string>('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [gasLimit, setGasLimit] = useState<string>('21000');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const chains = [
    { value: 'ethereum', label: 'Ethereum', icon: '⟠' },
    { value: 'base', label: 'Base', icon: '🔵' },
    { value: 'polygon', label: 'Polygon', icon: '💜' },
    { value: 'arbitrum', label: 'Arbitrum', icon: '🔷' },
    { value: 'optimism', label: 'Optimism', icon: '🔴' },
  ];

  const transactionTypes = [
    { value: 'transfer', label: 'Simple Transfer', gas: 21000 },
    { value: 'erc20', label: 'ERC-20 Transfer', gas: 65000 },
    { value: 'swap', label: 'DEX Swap', gas: 150000 },
    { value: 'nft', label: 'NFT Mint', gas: 85000 },
    { value: 'contract', label: 'Contract Interaction', gas: 200000 },
  ];

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
    const type = transactionTypes.find(t => t.value === value);
    if (type) {
      setGasLimit(type.gas.toString());
    }
  };

  const simulateTransaction = async () => {
    setIsSimulating(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock gas prices per chain
    const gasPrices: Record<string, number> = {
      ethereum: 25.5,
      base: 0.05,
      polygon: 50.2,
      arbitrum: 0.1,
      optimism: 0.08,
    };

    // Mock exchange rates
    const ethUsd = 2350.50;
    const usdIdr = 15650.00;

    const gasPrice = gasPrices[chain as keyof typeof gasPrices] || 25;
    const gas = parseInt(gasLimit) || 21000;
    
    // Calculate costs
    const totalCostEth = (gas * gasPrice) / 1e9; // Convert from Gwei
    const totalCostUsd = totalCostEth * ethUsd;
    const totalCostIdr = totalCostUsd * usdIdr;

    const result: SimulationResult = {
      success: true,
      estimatedGas: gas,
      gasPrice: gasPrice,
      totalCostEth: totalCostEth,
      totalCostUsd: totalCostUsd,
      totalCostIdr: totalCostIdr,
      executionTime: Math.random() * 2 + 1, // 1-3 seconds
      blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
      transactionHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    setSimulationResult(result);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-cyan-500 dark:bg-cyan-600">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Transaction Simulator
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Simulate real transactions and estimate exact costs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This is a simulation tool that estimates transaction costs without actually executing on-chain.
          No wallet connection required and no real transactions will be made.
        </AlertDescription>
      </Alert>

      {/* Simulation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Simulation</CardTitle>
          <CardDescription>
            Set up your transaction parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chain Selection */}
          <div className="space-y-2">
            <Label htmlFor="chain">Blockchain Network</Label>
            <Select value={chain} onValueChange={setChain}>
              <SelectTrigger id="chain">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chains.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.icon} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="txType">Transaction Type</Label>
            <Select value={transactionType} onValueChange={handleTransactionTypeChange}>
              <SelectTrigger id="txType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label} ({t.gas.toLocaleString()} gas)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
            />
          </div>

          {/* To Address */}
          <div className="space-y-2">
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Input
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm"
            />
          </div>

          {/* Gas Limit */}
          <div className="space-y-2">
            <Label htmlFor="gasLimit">Gas Limit</Label>
            <Input
              id="gasLimit"
              type="number"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              placeholder="21000"
            />
          </div>

          {/* Simulate Button */}
          <Button 
            onClick={simulateTransaction} 
            disabled={isSimulating}
            className="w-full"
            size="lg"
          >
            {isSimulating ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Simulating Transaction...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Simulate Transaction
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-green-600 dark:text-green-400">
                Simulation Successful
              </CardTitle>
            </div>
            <CardDescription>
              Transaction simulation completed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground">Estimated Gas Fee (ETH)</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {simulationResult.totalCostEth.toFixed(8)} ETH
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground">Cost in USD</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${simulationResult.totalCostUsd.toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-muted-foreground">Cost in IDR</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Rp {simulationResult.totalCostIdr.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Transaction Details
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Gas Used</p>
                  <p className="font-mono font-medium">
                    {simulationResult.estimatedGas.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Gas Price</p>
                  <p className="font-mono font-medium">
                    {simulationResult.gasPrice.toFixed(8)} Gwei
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Execution Time</p>
                  <p className="font-mono font-medium">
                    {simulationResult.executionTime.toFixed(2)}s
                  </p>
                </div>
                
                <div>
                  <p className="text-muted-foreground">Block Number</p>
                  <p className="font-mono font-medium">
                    #{simulationResult.blockNumber?.toLocaleString()}
                  </p>
                </div>
              </div>

              {simulationResult.transactionHash && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction Hash (Simulated)</p>
                  <code className="text-xs bg-white dark:bg-gray-950 p-2 rounded block overflow-x-auto">
                    {simulationResult.transactionHash}
                  </code>
                </div>
              )}
            </div>

            {/* Comparison Note */}
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                This transaction would cost <strong>Rp {simulationResult.totalCostIdr.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</strong> in gas fees.
                Compare this with traditional payment methods in the Dashboard tab!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Transaction Simulation Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              1
            </Badge>
            <div>
              <p className="font-medium">Configure Parameters</p>
              <p className="text-sm text-muted-foreground">
                Select blockchain, transaction type, amount, and recipient
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              2
            </Badge>
            <div>
              <p className="font-medium">Estimate Gas</p>
              <p className="text-sm text-muted-foreground">
                Calculate estimated gas usage based on transaction complexity
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              3
            </Badge>
            <div>
              <p className="font-medium">Calculate Costs</p>
              <p className="text-sm text-muted-foreground">
                Convert gas fees to ETH, USD, and IDR using live rates
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              4
            </Badge>
            <div>
              <p className="font-medium">Compare & Decide</p>
              <p className="text-sm text-muted-foreground">
                Use results to compare with traditional payment methods
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
