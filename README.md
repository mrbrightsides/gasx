# STC GasX ⛽

**STC GasX** is a **Web3 Cost Comparator** tool designed to help users visualize and compare the cost of blockchain-based (on-chain) transactions against traditional off-chain costs, such as bank transfer fees, OTA commissions, or manual administrative costs. It is particularly suitable for academic studies, case studies, and operational cost analysis of Web3 applications.

The tool integrates data from **STC Analytics** and live APIs to compute costs in **ETH**, **USD**, and **IDR**, enabling clear visualization of cost efficiency.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Status](https://img.shields.io/badge/status-beta-yellow)]()

---

## Key Features
- Fetch **Ethereum gas fees** from Infura (Sepolia or Mainnet).  
- Convert ETH → USD → IDR automatically using CoinGecko and Frankfurter APIs.  
- Compare on-chain costs with off-chain fees:
  - Bank transfer fee (default: Rp 6,500)
  - OTA commission (default: 20%)
  - Fixed admin fee (default: Rp 25,000)  
- Normalize costs **per transaction**.  
- Visualizations:
  - **Bar chart:** On-chain vs Off-chain per transaction.  
  - **Line chart:** Gas fee fluctuation vs stable fiat fees.  
  - **Pie chart:** Fee breakdown (miner, OTA commission, admin).  
- Interactive parameter adjustments (gas price, rates, fees).  
- SIWE (Sign-In With Ethereum) authentication:
  - Wallet address stored only
  - Optional display name  
- Export **CSV** and **PNG charts**.

---

## Pipeline & Data Flow

### Input
- **Source:** CSV export from [STC Analytics](https://stc-analytics.streamlit.app/)  
- **Analytics schema:**
  > Timestamp, Network, Tx Hash, Contract, Function, Block, Gas Used, Gas Price (Gwei), Estimated Fee (ETH), Estimated Fee (Rp), Status
- **Mapping for GasX:**
  > Timestamp, Tx Hash, Gas Used, Gas Price (Gwei), Fee (ETH), Fee (Rp)

---


### User Inputs
| Parameter | Default | Notes |
|-----------|--------|-------|
| bank_transfer_fee_rp | 6500 | Can override via form |
| ota_commission_pct | 20 | Percentage of base amount |
| admin_fee_rp | 25000 | Fixed admin cost |
| allow_override | true | User can override values |

### Process
1. Normalize on-chain cost per transaction  
2. Compute off-chain total cost  
3. Compare on-chain vs off-chain per transaction  
4. Generate comparison dataset

### Visualization
- **Bar chart:** On-chain vs Off-chain per transaction  
- **Line chart:** Gas fee trend vs stable fees  
- **Pie chart:** Fee composition (miner fee, OTA %, admin fee)  

### Output
- CSV
- PNG charts
- Metadata: original analytics columns retained optionally

### Expected Schema (comparison dataset)
| Column | Description |
|--------|------------|
| Timestamp | From Analytics |
| Tx Hash | From Analytics |
| Gas Fee (Rp) | On-chain fee from Analytics |
| Off-chain Bank Fee (Rp) | From user input |
| OTA Commission (Rp) | Calculated from user % × transaction base |
| Admin Fee (Rp) | From user input |
| Off-chain Total (Rp) | Bank Fee + OTA Commission + Admin Fee |
| Comparison Result | Label: On-chain Cheaper / Off-chain Cheaper / Equal |

---

## Authentication
- **Method:** SIWE (Sign-In With Ethereum)  
- **Storage:** Wallet address only  
- **Optional:** User display name

---

## Example Dataset
```csv
Timestamp,Tx Hash,Gas Used,Gas Price (Gwei),Fee (ETH),Fee (Rp)
2025-09-17 10:21:05,0xabc123...,21000,15,0.000315,7400
2025-09-17 10:25:42,0xdef456...,48000,18,0.000864,20300
2025-09-17 10:33:18,0xghi789...,52000,20,0.00104,24400
2025-09-17 10:40:55,0xjkl012...,25000,14,0.00035,8200
2025-09-17 10:45:30,0xmnq345...,30000,17,0.00051,11950
2025-09-17 10:52:44,0xprs678...,41000,16,0.000656,15380
2025-09-17 11:00:01,0xtuv901...,22000,19,0.000418,9800
2025-09-17 11:08:22,0xwxy234...,33000,21,0.000693,16200
2025-09-17 11:15:19,0xzab567...,27000,13,0.000351,8200
2025-09-17 11:22:40,0xcde890...,60000,22,0.00132,30500
```

---

## Tech Stack

- Backend: FastAPI (compute gas cost, fetch ETH/USD/IDR conversion)

- Frontend: React / Next.js (Chart.js or Recharts dashboard)

- Containerization: Docker & Docker Compose

- APIs:

  - Infura: https://sepolia.infura.io/v3/YOUR_PROJECT_ID

  - CoinGecko: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd

  - Frankfurter: https://api.frankfurter.app/latest?from=USD&to=IDR
 
---

## Usage Example

1. Upload CSV export from STC Analytics

2. Adjust user input parameters (if needed)

3. Visualize on-chain vs off-chain comparison

4. Export charts and CSV report

---

## Notes

- Prioritize academic-ready visualizations for dissertation use

- No smart contract deployment needed; only fetch gas data

- Designed for transparent, normalized transaction comparison

---

## License

MIT License
