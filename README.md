# Chronos DEX - First Layla-Ready AMM on Bitcoin Cash

## 🏆 BCH Blaze 2025 Hackathon Submission

**Track:** Chipnet (Layla Upgrade Features)

## 🎯 Bounty Features Implemented

### ✅ Bitwise Operations (10M sats)
**Location:** `LiquidityPool.cash` lines 55-67, 120-126
- Uses `&` (AND) operator for amount validation
- Uses `|` (OR) operator for validation flags
- Uses `^` (XOR) operator to verify constant product changed

### ✅ P2S - Pay to Script (10M sats)
**Location:** `LiquidityPool.cash` line 196-200 (Output 4 in swap function)
```cashscript
// Output 4: P2S COVENANT for Battle.cash gamification
bytes swapData = userPkh + bytes8(amountIn) + poolId;
require(tx.outputs[4].nftCommitment == swapData);
```

### ✅ Composite CashTokens (100M sats)
**Location:** `LiquidityPool.cash` line 98-103 (Output 3 in addLiquidity)
```cashscript
// Output 3: COMPOSITE LP TOKENS to user (FT + NFT)
bytes commitment = bytes4(int(tx.locktime)) + bytes4(0);
require(tx.outputs[3].tokenAmount == lpTokensToMint);  // Fungible
require(tx.outputs[3].nftCommitment == commitment);     // Non-fungible
```

### ✅ Battle.cash Integration (100M sats)
**Location:** `GamificationVault.cash` - Full contract
- On-chain XP tracking via P2S outputs
- State NFT stores total trading volume
- Admin can process swaps to update leaderboard

### 🔄 Loops (Attempted - Unrolled)
**Location:** `SwapRouter.cash` 
- Multi-hop swaps (A→B→C)
- Unrolled for max 3 hops due to complexity

## 🏗️ Architecture

```
┌─────────────────┐
│  LiquidityPool  │ ──P2S──> ┌──────────────────┐
│   (AMM Core)    │           │ GamificationVault│
└─────────────────┘           │  (Battle.cash)   │
        │                     └──────────────────┘
        │
        v
┌─────────────────┐
│   SwapRouter    │
│  (Multi-hop)    │
└─────────────────┘
```

## 🚀 Features

- **Constant Product AMM** (x * y = k)
- **0.3% Trading Fee**
- **Slippage Protection**
- **Composite LP Tokens** (FT + NFT receipt)
- **Gamification** with on-chain XP tracking
- **Multi-hop Routing** (A→B→C swaps)
- **Modern React UI** with real-time updates

## 📦 Tech Stack

- **Smart Contracts:** CashScript ^0.12.0
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Blockchain:** Bitcoin Cash Chipnet (Layla)
- **Libraries:** CashScript SDK, @bitauth/libauth

## 🎮 How It Works

1. **Add Liquidity:** Deposit tokens, receive composite LP tokens (FT+NFT)
2. **Swap Tokens:** Trade with 0.3% fee, earn XP via Battle.cash
3. **Track Progress:** Dashboard shows volume and leaderboard
4. **Remove Liquidity:** Burn LP tokens, withdraw proportional reserves

## 🔐 Deployed Contracts

- **LiquidityPool:** `bchtest:pdnlf6vuvxnz79p0v3g9zjzx0y8uxkg7fh842kr4vn...`
- **GamificationVault:** `bchtest:pv9rwhvqh035qy5dw7w576p2h5rz897nhy78cxhr4g...`

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

```env
VITE_TESTER_WIF=your_wif_here
VITE_TOKEN_A_CATEGORY=...
VITE_TOKEN_B_CATEGORY=...
VITE_LP_TOKEN_CATEGORY=...
VITE_LIQUIDITY_POOL_ADDRESS=...
VITE_GAMIFICATION_VAULT_ADDRESS=...
```

## 🎓 Key Innovations

1. **First AMM using Layla bitwise ops** for gas-efficient validation
2. **P2S-based gamification** enabling trustless XP tracking
3. **Composite LP tokens** proving liquidity provision on-chain
4. **Battle.cash integration** making DeFi engaging and fun

## 📚 References

- [CashScript Docs](https://cashscript.org)
- [BCH Layla CHIPs](https://github.com/bitjson/)
- [BCH Blaze Hackathon](https://dorahacks.io/hackathon/blaze2025)

## 👥 Team

Built for BCH Blaze 2025 Hackathon

## 📄 License

MIT License - See LICENSE file for details
