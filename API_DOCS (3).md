# 🛠️ STC GasX API Documentation

<div align="center">

**RESTful API for Web3 Cost Analysis Integration**

Version 1.0.0 | Last Updated: January 2025

[Overview](#overview) | [Authentication](#authentication) | [Endpoints](#endpoints) | [Examples](#examples) | [Rate Limits](#rate-limits)

</div>

---

## Overview

The STC GasX API provides programmatic access to Web3 cost analysis data, enabling developers to integrate real-time gas prices, exchange rates, and cost comparison calculations into their own applications, trading bots, research tools, or dashboards.

### Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

### Features

✅ **No Authentication Required** - Public API for all endpoints  
✅ **Real-time Data** - Live gas prices and exchange rates  
✅ **Multi-Chain Support** - Ethereum, Base, Polygon, Arbitrum, Optimism  
✅ **Multi-Currency** - 6 Southeast Asian currencies supported  
✅ **High Rate Limits** - 100 requests per minute per IP  
✅ **RESTful Design** - Standard HTTP methods and JSON responses  

---

## Authentication

**No authentication required!** All endpoints are publicly accessible.

### Headers

```http
Content-Type: application/json
Accept: application/json
```

---

## Endpoints

### 1. Get Multi-Chain Gas Prices

Retrieve current gas prices across all supported blockchains.

```http
GET /api/gas-price
```

#### Request

No parameters required.

#### Response

```json
{
  "ethereum": {
    "gasPrice": 25.5,
    "timestamp": "2025-01-10T10:30:00Z",
    "network": "sepolia"
  },
  "base": {
    "gasPrice": 0.05,
    "timestamp": "2025-01-10T10:30:00Z",
    "network": "base"
  },
  "polygon": {
    "gasPrice": 30.2,
    "timestamp": "2025-01-10T10:30:00Z",
    "network": "amoy"
  },
  "arbitrum": {
    "gasPrice": 0.1,
    "timestamp": "2025-01-10T10:30:00Z",
    "network": "arbitrum-sepolia"
  },
  "optimism": {
    "gasPrice": 0.08,
    "timestamp": "2025-01-10T10:30:00Z",
    "network": "optimism-sepolia"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `gasPrice` | number | Gas price in Gwei |
| `timestamp` | string | ISO 8601 timestamp |
| `network` | string | Network identifier |

#### Error Responses

```json
{
  "error": "Failed to fetch gas prices",
  "message": "External API temporarily unavailable",
  "code": 503
}
```

---

### 2. Get Exchange Rates

Retrieve current ETH pricing and multi-currency exchange rates.

```http
GET /api/exchange-rate
```

#### Request

**Optional Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `currencies` | string | all | Comma-separated currency codes (idr,myr,thb,php,sgd,vnd) |

#### Response

```json
{
  "ethToUsd": 2450.50,
  "currencies": {
    "idr": 15650.25,
    "myr": 4.42,
    "thb": 33.15,
    "php": 56.30,
    "sgd": 1.34,
    "vnd": 24820.00
  },
  "timestamp": "2025-01-10T10:30:00Z",
  "sources": {
    "eth": "coingecko",
    "fiat": "frankfurter"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `ethToUsd` | number | ETH price in USD |
| `currencies` | object | USD to local currency rates |
| `timestamp` | string | ISO 8601 timestamp |
| `sources` | object | Data source identifiers |

#### Example with Currency Filter

```http
GET /api/exchange-rate?currencies=idr,myr,sgd
```

```json
{
  "ethToUsd": 2450.50,
  "currencies": {
    "idr": 15650.25,
    "myr": 4.42,
    "sgd": 1.34
  },
  "timestamp": "2025-01-10T10:30:00Z"
}
```

---

### 3. Compare Transaction Costs

Calculate and compare on-chain vs off-chain transaction costs.

```http
POST /api/compare
```

#### Request

```json
{
  "amount": 500000,
  "gasUsed": 21000,
  "gasPrice": 25,
  "chain": "ethereum",
  "bankFee": 6500,
  "otaCommission": 15,
  "adminFee": 25000,
  "currency": "idr"
}
```

#### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | number | Yes | Transaction amount in selected currency |
| `gasUsed` | number | Yes | Gas units (21000 for simple transfer) |
| `gasPrice` | number | Yes | Gas price in Gwei |
| `chain` | string | No | Blockchain (ethereum/base/polygon/arbitrum/optimism) |
| `bankFee` | number | Yes | Bank transfer fee in local currency |
| `otaCommission` | number | Yes | OTA commission percentage (0-100) |
| `adminFee` | number | Yes | Admin fee in local currency |
| `currency` | string | No | Currency code (default: idr) |

#### Response

```json
{
  "onChain": {
    "eth": 0.000525,
    "usd": 1.29,
    "idr": 20189,
    "gasUsed": 21000,
    "gasPrice": 25,
    "chain": "ethereum"
  },
  "offChain": {
    "total": 106500,
    "breakdown": {
      "bankFee": 6500,
      "otaCommission": 75000,
      "adminFee": 25000
    },
    "currency": "idr"
  },
  "comparison": {
    "cheaper": "onChain",
    "savings": 86311,
    "savingsPercentage": 81.04,
    "recommendation": "Use blockchain for this transaction to save 81%"
  },
  "timestamp": "2025-01-10T10:30:00Z"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `onChain.eth` | number | Cost in ETH |
| `onChain.usd` | number | Cost in USD |
| `onChain.idr` | number | Cost in local currency |
| `offChain.total` | number | Total off-chain cost |
| `offChain.breakdown` | object | Itemized off-chain costs |
| `comparison.cheaper` | string | Which method is cheaper (onChain/offChain) |
| `comparison.savings` | number | Absolute savings amount |
| `comparison.savingsPercentage` | number | Savings as percentage |
| `comparison.recommendation` | string | Human-readable recommendation |

---

## Examples

### JavaScript (Fetch API)

#### Get Gas Prices

```javascript
async function getGasPrices() {
  try {
    const response = await fetch('https://your-domain.com/api/gas-price');
    const data = await response.json();
    
    console.log('Ethereum gas:', data.ethereum.gasPrice, 'Gwei');
    console.log('Base gas:', data.base.gasPrice, 'Gwei');
    
    return data;
  } catch (error) {
    console.error('Error fetching gas prices:', error);
  }
}

getGasPrices();
```

#### Compare Costs

```javascript
async function compareCosts(transactionData) {
  try {
    const response = await fetch('https://your-domain.com/api/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 500000,
        gasUsed: 21000,
        gasPrice: 25,
        chain: 'ethereum',
        bankFee: 6500,
        otaCommission: 15,
        adminFee: 25000,
        currency: 'idr'
      })
    });
    
    const data = await response.json();
    
    console.log('On-chain cost:', data.onChain.idr, 'IDR');
    console.log('Off-chain cost:', data.offChain.total, 'IDR');
    console.log('Cheaper method:', data.comparison.cheaper);
    console.log('Savings:', data.comparison.savings, 'IDR');
    
    return data;
  } catch (error) {
    console.error('Error comparing costs:', error);
  }
}

compareCosts();
```

---

### Python (Requests)

#### Get Exchange Rates

```python
import requests

def get_exchange_rates(currencies=None):
    url = 'https://your-domain.com/api/exchange-rate'
    
    params = {}
    if currencies:
        params['currencies'] = ','.join(currencies)
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        print(f"ETH/USD: ${data['ethToUsd']}")
        for currency, rate in data['currencies'].items():
            print(f"USD/{currency.upper()}: {rate}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Get all currencies
rates = get_exchange_rates()

# Get specific currencies
rates = get_exchange_rates(['idr', 'myr', 'sgd'])
```

#### Compare Costs

```python
import requests

def compare_transaction_costs(amount, gas_used, gas_price, bank_fee, ota_commission, admin_fee):
    url = 'https://your-domain.com/api/compare'
    
    payload = {
        'amount': amount,
        'gasUsed': gas_used,
        'gasPrice': gas_price,
        'chain': 'ethereum',
        'bankFee': bank_fee,
        'otaCommission': ota_commission,
        'adminFee': admin_fee,
        'currency': 'idr'
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        print(f"On-chain cost: Rp {data['onChain']['idr']:,.0f}")
        print(f"Off-chain cost: Rp {data['offChain']['total']:,.0f}")
        print(f"Savings: Rp {data['comparison']['savings']:,.0f} ({data['comparison']['savingsPercentage']:.2f}%)")
        print(f"Recommendation: {data['comparison']['recommendation']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Example usage
result = compare_transaction_costs(
    amount=500000,
    gas_used=21000,
    gas_price=25,
    bank_fee=6500,
    ota_commission=15,
    admin_fee=25000
)
```

---

### cURL

#### Get Gas Prices

```bash
curl -X GET 'https://your-domain.com/api/gas-price' \
  -H 'Accept: application/json'
```

#### Get Exchange Rates

```bash
curl -X GET 'https://your-domain.com/api/exchange-rate?currencies=idr,myr,sgd' \
  -H 'Accept: application/json'
```

#### Compare Costs

```bash
curl -X POST 'https://your-domain.com/api/compare' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "amount": 500000,
    "gasUsed": 21000,
    "gasPrice": 25,
    "chain": "ethereum",
    "bankFee": 6500,
    "otaCommission": 15,
    "adminFee": 25000,
    "currency": "idr"
  }'
```

---

## Rate Limits

### Current Limits

- **100 requests per minute** per IP address
- **1000 requests per hour** per IP address
- **10,000 requests per day** per IP address

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704878400
```

### Exceeded Rate Limit Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 100 requests per minute allowed",
  "retryAfter": 45,
  "code": 429
}
```

### Best Practices

1. **Cache responses** when possible (gas prices change slowly)
2. **Implement exponential backoff** for retries
3. **Monitor rate limit headers** to avoid hitting limits
4. **Batch requests** when analyzing multiple scenarios

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "code": 400,
  "details": {
    "field": "gasPrice",
    "issue": "Must be a positive number"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | Endpoint doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | External API unavailable |

---

## Use Cases

### 1. Trading Bot Integration

```javascript
// Monitor gas prices and execute when optimal
async function gasMonitoringBot() {
  const threshold = 15; // Gwei
  
  setInterval(async () => {
    const prices = await fetch('/api/gas-price').then(r => r.json());
    
    if (prices.ethereum.gasPrice < threshold) {
      console.log('Gas is low! Execute transactions now.');
      // Execute your trading logic
    }
  }, 60000); // Check every minute
}
```

### 2. Cost Comparison Dashboard

```javascript
// Build real-time cost comparison dashboard
async function updateDashboard() {
  const [gas, rates] = await Promise.all([
    fetch('/api/gas-price').then(r => r.json()),
    fetch('/api/exchange-rate').then(r => r.json())
  ]);
  
  // Calculate costs for your specific use case
  const comparison = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 1000000,
      gasUsed: 65000, // ERC-20 transfer
      gasPrice: gas.ethereum.gasPrice,
      bankFee: 6500,
      otaCommission: 15,
      adminFee: 25000
    })
  }).then(r => r.json());
  
  // Update your dashboard UI
  updateUI(comparison);
}
```

### 3. Research Data Collection

```python
import requests
import pandas as pd
from datetime import datetime, timedelta

def collect_historical_data(days=30):
    """Collect gas price data for research"""
    data = []
    
    for i in range(days):
        try:
            response = requests.get('https://your-domain.com/api/gas-price')
            prices = response.json()
            
            data.append({
                'timestamp': datetime.now(),
                'eth_gas': prices['ethereum']['gasPrice'],
                'base_gas': prices['base']['gasPrice'],
                'polygon_gas': prices['polygon']['gasPrice']
            })
            
            time.sleep(3600)  # Collect hourly
        except Exception as e:
            print(f"Error: {e}")
    
    df = pd.DataFrame(data)
    df.to_csv('gas_price_data.csv', index=False)
    return df
```

---

## Webhooks (Coming Soon)

Future support for webhook notifications:

- Gas price alerts
- Significant price changes
- Exchange rate fluctuations
- Custom triggers

**Status**: Planned for Phase 4 (Community Features)

---

## Support

### Resources

- 📖 [User Guide](./USER_GUIDE.md)
- 🏠 [Main Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/mrbrightsides/stc-gasx/issues)
- 💬 [Discussions](https://github.com/mrbrightsides/stc-gasx/discussions)

### Contact

- **Email**: api@stcgasx.com
- **GitHub**: [@mrbrightsides](https://github.com/mrbrightsides)
- **Telegram**: [@stcgasx](https://t.me/stcgasx)

---

## Changelog

### Version 1.0.0 (January 2025)
- Initial API release
- Multi-chain gas price endpoint
- Exchange rate endpoint
- Cost comparison endpoint
- Public access with rate limits

---

<div align="center">

**STC GasX API** - Powering Web3 Cost Analysis

*Built with ❤️ for developers*

[Back to Top](#-stc-gasx-api-documentation)

</div>
