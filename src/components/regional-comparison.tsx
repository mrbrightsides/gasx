'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, TrendingUp, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  country: string;
}

interface ExchangeRate {
  usd: number;
  gasFeeCurrency: number;
  bankFee: number;
  avgOtaCommission: number;
}

export function RegionalComparison() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('IDR');
  const [exchangeRates, setExchangeRates] = useState<Record<string, ExchangeRate>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currencies: Currency[] = [
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', country: 'Indonesia' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', country: 'Malaysia' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', country: 'Thailand' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', country: 'Philippines' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', country: 'Singapore' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', country: 'Vietnam' },
  ];

  // Typical bank transfer fees and OTA commissions by country
  const regionalData: Record<string, { bankFee: number; otaCommission: number }> = {
    IDR: { bankFee: 6500, otaCommission: 15 },
    MYR: { bankFee: 1, otaCommission: 12 },
    THB: { bankFee: 25, otaCommission: 15 },
    PHP: { bankFee: 50, otaCommission: 18 },
    SGD: { bankFee: 2, otaCommission: 10 },
    VND: { bankFee: 5000, otaCommission: 15 },
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    
    try {
      // Fetch USD exchange rates
      const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=IDR,MYR,THB,PHP,SGD,VND');
      const data = await response.json();
      
      // Mock ETH price (in real app, fetch from CoinGecko)
      const ethUsd = 2350.50;
      const gasUsed = 21000;
      const gasPriceGwei = 25;
      const gasFeeEth = (gasUsed * gasPriceGwei) / 1e9;
      const gasFeeUsd = gasFeeEth * ethUsd;
      
      const rates: Record<string, ExchangeRate> = {};
      
      currencies.forEach(currency => {
        const usdRate = data.rates[currency.code] || 1;
        const regional = regionalData[currency.code];
        
        rates[currency.code] = {
          usd: usdRate,
          gasFeeCurrency: gasFeeUsd * usdRate,
          bankFee: regional.bankFee,
          avgOtaCommission: regional.otaCommission,
        };
      });
      
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      // Fallback to mock data
      const mockRates: Record<string, ExchangeRate> = {
        IDR: { usd: 15650, gasFeeCurrency: 91893, bankFee: 6500, avgOtaCommission: 15 },
        MYR: { usd: 4.35, gasFeeCurrency: 25.54, bankFee: 1, avgOtaCommission: 12 },
        THB: { usd: 33.5, gasFeeCurrency: 196.74, bankFee: 25, avgOtaCommission: 15 },
        PHP: { usd: 56.5, gasFeeCurrency: 331.73, bankFee: 50, avgOtaCommission: 18 },
        SGD: { usd: 1.34, gasFeeCurrency: 7.87, bankFee: 2, avgOtaCommission: 10 },
        VND: { usd: 24500, gasFeeCurrency: 143836, bankFee: 5000, avgOtaCommission: 15 },
      };
      setExchangeRates(mockRates);
    }
    
    setIsLoading(false);
  };

  const getChartData = () => {
    return currencies.map(currency => {
      const rate = exchangeRates[currency.code];
      if (!rate) return null;
      
      return {
        country: `${currency.flag} ${currency.code}`,
        'Gas Fee': Math.round(rate.gasFeeCurrency),
        'Bank Fee': rate.bankFee,
        'OTA Commission (%)': rate.avgOtaCommission,
      };
    }).filter(Boolean);
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const selectedRate = exchangeRates[selectedCurrency];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-indigo-500 dark:bg-indigo-600">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Regional Comparison
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Compare Web3 costs across Southeast Asian currencies
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Currency Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Currency</CardTitle>
          <CardDescription>
            Choose your local currency to see cost comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.flag} {currency.name} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Selected Currency Details */}
      {selectedRate && selectedCurrencyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-3xl">{selectedCurrencyData.flag}</span>
              {selectedCurrencyData.country}
            </CardTitle>
            <CardDescription>
              Cost breakdown in {selectedCurrencyData.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-muted-foreground">On-chain Gas Fee</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedCurrencyData.symbol} {selectedRate.gasFeeCurrency.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-muted-foreground">Typical Bank Fee</p>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {selectedCurrencyData.symbol} {selectedRate.bankFee.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-sm text-muted-foreground">Avg. OTA Commission</p>
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {selectedRate.avgOtaCommission}%
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <p className="text-sm text-muted-foreground mb-1">Exchange Rate (USD to {selectedCurrencyData.code})</p>
              <p className="text-xl font-bold">
                1 USD = {selectedCurrencyData.symbol} {selectedRate.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Cost Comparison</CardTitle>
          <CardDescription>
            Gas fees and bank fees across Southeast Asia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="country" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Gas Fee" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Bank Fee" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Regional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Insights</CardTitle>
          <CardDescription>
            Understanding cost variations across Southeast Asia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currencies.map(currency => {
            const rate = exchangeRates[currency.code];
            if (!rate) return null;

            const cheaper = rate.gasFeeCurrency < rate.bankFee ? 'blockchain' : 'bank';
            const savings = Math.abs(rate.gasFeeCurrency - rate.bankFee);
            const savingsPercent = ((savings / Math.max(rate.gasFeeCurrency, rate.bankFee)) * 100).toFixed(1);

            return (
              <div
                key={currency.code}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currency.flag}</span>
                  <div>
                    <p className="font-medium">{currency.country}</p>
                    <p className="text-sm text-muted-foreground">
                      {currency.name} ({currency.symbol})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={cheaper === 'blockchain' ? 'default' : 'secondary'}>
                    {cheaper === 'blockchain' ? 'Blockchain Cheaper' : 'Bank Cheaper'}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save {savingsPercent}%
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              💡
            </Badge>
            <p className="text-sm">
              <strong>Singapore & Malaysia</strong> have the lowest traditional banking fees in the region, making blockchain less competitive for small transactions.
            </p>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              📊
            </Badge>
            <p className="text-sm">
              <strong>Indonesia & Vietnam</strong> show significant blockchain advantages due to higher traditional banking costs and exchange rates.
            </p>
          </div>

          <div className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0">
              🚀
            </Badge>
            <p className="text-sm">
              <strong>OTA Commissions</strong> across the region (10-18%) make blockchain particularly attractive for travel and e-commerce platforms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
