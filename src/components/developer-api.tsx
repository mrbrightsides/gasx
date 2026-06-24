'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, Check, Terminal, Book, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DeveloperAPI() {
  const [copied, setCopied] = useState<string>('');

  const copyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/gas-price',
      description: 'Get current gas prices from multiple chains',
      params: [
        { name: 'chain', type: 'string', required: false, description: 'ethereum | base | polygon | arbitrum | optimism' }
      ],
      response: `{
  "ethereum": 25.5,
  "base": 0.05,
  "polygon": 50.2,
  "arbitrum": 0.1,
  "optimism": 0.08,
  "timestamp": 1234567890
}`
    },
    {
      method: 'GET',
      path: '/api/exchange-rate',
      description: 'Get ETH to fiat exchange rates',
      params: [
        { name: 'currency', type: 'string', required: false, description: 'USD | IDR | MYR | THB | PHP | SGD' }
      ],
      response: `{
  "eth_usd": 2350.50,
  "usd_idr": 15650.00,
  "eth_idr": 36775075.00,
  "timestamp": 1234567890
}`
    },
    {
      method: 'POST',
      path: '/api/compare',
      description: 'Compare on-chain vs off-chain costs',
      params: [],
      body: `{
  "gasUsed": 21000,
  "gasPriceGwei": 25,
  "bankFee": 6500,
  "otaCommission": 15,
  "adminFee": 25000,
  "baseAmount": 500000
}`,
      response: `{
  "onChainCost": {
    "eth": 0.000525,
    "usd": 1.23,
    "idr": 19349.25
  },
  "offChainCost": {
    "bank": 6500,
    "ota": 75000,
    "admin": 25000,
    "total": 106500
  },
  "comparison": {
    "cheaper": "onchain",
    "savings": 87150.75,
    "savingsPercent": 81.82
  }
}`
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript / Node.js Example
const response = await fetch('/api/gas-price?chain=ethereum');
const data = await response.json();
console.log('Gas Price:', data.ethereum, 'Gwei');

// Compare costs
const comparison = await fetch('/api/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    gasUsed: 21000,
    gasPriceGwei: 25,
    bankFee: 6500,
    otaCommission: 15,
    adminFee: 25000,
    baseAmount: 500000
  })
});
const result = await comparison.json();
console.log('Cheaper option:', result.comparison.cheaper);`,
    
    python: `# Python Example
import requests

# Get gas prices
response = requests.get('https://stcgasx.app/api/gas-price?chain=ethereum')
data = response.json()
print(f"Gas Price: {data['ethereum']} Gwei")

# Compare costs
comparison = requests.post('https://stcgasx.app/api/compare', json={
    'gasUsed': 21000,
    'gasPriceGwei': 25,
    'bankFee': 6500,
    'otaCommission': 15,
    'adminFee': 25000,
    'baseAmount': 500000
})
result = comparison.json()
print(f"Cheaper option: {result['comparison']['cheaper']}")`,
    
    curl: `# cURL Example
# Get gas prices
curl -X GET "https://stcgasx.app/api/gas-price?chain=ethereum"

# Compare costs
curl -X POST "https://stcgasx.app/api/compare" \\
  -H "Content-Type: application/json" \\
  -d '{
    "gasUsed": 21000,
    "gasPriceGwei": 25,
    "bankFee": 6500,
    "otaCommission": 15,
    "adminFee": 25000,
    "baseAmount": 500000
  }'`
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-green-500 dark:bg-green-600">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Developer API
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Integrate STC GasX into your applications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started with the STC GasX API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertDescription>
              <strong>Base URL:</strong> <code className="text-sm font-mono">https://stcgasx.app/api</code>
              <br />
              <strong>Rate Limit:</strong> 100 requests per minute
              <br />
              <strong>Authentication:</strong> Not required for public endpoints
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="font-medium">Features:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Real-time gas prices from 5 major blockchains</li>
              <li>Live ETH and multi-currency exchange rates</li>
              <li>Cost comparison calculations</li>
              <li>RESTful JSON API</li>
              <li>No authentication required</li>
              <li>CORS enabled for browser requests</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            Available endpoints and their parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {endpoints.map((endpoint, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Badge 
                  variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                  className="font-mono"
                >
                  {endpoint.method}
                </Badge>
                <code className="text-sm font-mono">{endpoint.path}</code>
              </div>
              
              <p className="text-sm text-muted-foreground">{endpoint.description}</p>
              
              {endpoint.params && endpoint.params.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Parameters:</p>
                  <div className="space-y-1">
                    {endpoint.params.map((param, pidx) => (
                      <div key={pidx} className="text-sm pl-4">
                        <code className="font-mono">{param.name}</code>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="destructive" className="ml-1 text-xs">
                            required
                          </Badge>
                        )}
                        <p className="text-muted-foreground mt-1">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {endpoint.body && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Request Body:</p>
                  <div className="relative">
                    <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                      <code>{endpoint.body}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => copyCode(endpoint.body || '', `body-${idx}`)}
                    >
                      {copied === `body-${idx}` ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Response:</p>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                    <code>{endpoint.response}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => copyCode(endpoint.response, `response-${idx}`)}
                  >
                    {copied === `response-${idx}` ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
          <CardDescription>
            Integration examples in different languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            {Object.entries(codeExamples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang} className="mt-4">
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyCode(code, lang)}
                  >
                    {copied === lang ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
          <CardDescription>
            What you can build with the API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 h-fit">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium">Trading Bots & DApps</p>
              <p className="text-sm text-muted-foreground">
                Optimize gas timing and cost analysis in your trading applications
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 h-fit">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">Analytics Dashboards</p>
              <p className="text-sm text-muted-foreground">
                Build real-time Web3 cost monitoring and comparison tools
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 h-fit">
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium">Research Tools</p>
              <p className="text-sm text-muted-foreground">
                Automate data collection for academic research and analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
