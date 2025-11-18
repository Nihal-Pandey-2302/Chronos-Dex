#!/usr/bin/env node

/**
 * CHRONOS DEX - Simple Contract Deployment
 * Works with CashScript v0.12.0
 */

import { Contract, ElectrumNetworkProvider } from 'cashscript';
import { hexToBin, binToHex, hash160 } from '@bitauth/libauth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getEnv(envContent, key) {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  const value = match ? match[1].trim() : '';
  return value;
}

async function main() {
  console.log('🚀 CHRONOS DEX - Contract Deployment\n');
  
  // Load environment
  const envPath = path.join(__dirname, '../frontend/.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found');
    console.log('Run: node scripts/00-setup-wallet-proper.mjs first\n');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const tokenA = getEnv(envContent, 'VITE_TOKEN_A_CATEGORY');
  const tokenB = getEnv(envContent, 'VITE_TOKEN_B_CATEGORY');
  const lpToken = getEnv(envContent, 'VITE_LP_TOKEN_CATEGORY');
  
  if (!tokenA || !tokenB || !lpToken) {
    console.error('❌ Token categories not found in .env.local');
    console.log('\nYou need to:');
    console.log('1. Fund your wallet');
    console.log('2. Mint 3 tokens in Cashonize');
    console.log('3. Save token category IDs to .env.local\n');
    process.exit(1);
  }
  
  console.log('📋 Token Categories:');
  console.log(`Token A: ${tokenA}`);
  console.log(`Token B: ${tokenB}`);
  console.log(`LP Token: ${lpToken}\n`);
  
  // Load artifacts
  const poolArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../contracts/LiquidityPool.json'), 'utf8')
  );
  
  const vaultArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../contracts/GamificationVault.json'), 'utf8')
  );
  
  // Connect to Chipnet
  console.log('🔌 Connecting to Chipnet...');
  const provider = new ElectrumNetworkProvider('chipnet');
  console.log('✅ Connected\n');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 DEPLOYING LIQUIDITY POOL');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Generate deterministic pool ID
  const poolIdInput = tokenA + tokenB + lpToken;
  const poolId = hash160(hexToBin(poolIdInput));
  
  console.log(`Pool ID: ${binToHex(poolId)}`);
  
  // Instantiate pool contract
  const poolArgs = [
    hexToBin(tokenA),
    hexToBin(tokenB),
    hexToBin(lpToken),
    poolId,
  ];
  
  const pool = new Contract(poolArtifact, poolArgs, { provider });
  
  console.log(`\n✅ LiquidityPool Contract:`);
  console.log(`Address: ${pool.address}`);
  console.log(`Bytecode: ${pool.bytecode.length / 2} bytes\n`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 DEPLOYING GAMIFICATION VAULT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Vault args (using placeholders)
  const adminPkh = hexToBin('0000000000000000000000000000000000000000');
  const stateTokenCategory = hexToBin('0000000000000000000000000000000000000000000000000000000000000000');
  
  const vaultArgs = [adminPkh, stateTokenCategory];
  const vault = new Contract(vaultArtifact, vaultArgs, { provider });
  
  console.log(`✅ GamificationVault Contract:`);
  console.log(`Address: ${vault.address}`);
  console.log(`Bytecode: ${vault.bytecode.length / 2} bytes\n`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DEPLOYMENT COMPLETE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Update .env.local
  console.log('📝 Updating .env.local...');
  
  let updatedEnv = envContent;
  updatedEnv = updatedEnv.replace(
    /VITE_LIQUIDITY_POOL_ADDRESS=.*/,
    `VITE_LIQUIDITY_POOL_ADDRESS=${pool.address}`
  );
  updatedEnv = updatedEnv.replace(
    /VITE_GAMIFICATION_VAULT_ADDRESS=.*/,
    `VITE_GAMIFICATION_VAULT_ADDRESS=${vault.address}`
  );
  updatedEnv = updatedEnv.replace(
    /VITE_LIQUIDITY_POOL_ARGS_JSON=.*/,
    `VITE_LIQUIDITY_POOL_ARGS_JSON=${JSON.stringify(poolArgs.map(arg => binToHex(arg)))}`
  );
  updatedEnv = updatedEnv.replace(
    /VITE_GAMIFICATION_VAULT_ARGS_JSON=.*/,
    `VITE_GAMIFICATION_VAULT_ARGS_JSON=${JSON.stringify(vaultArgs.map(arg => binToHex(arg)))}`
  );
  
  fs.writeFileSync(envPath, updatedEnv);
  console.log('✅ Updated\n');
  
  console.log('🎯 NEXT STEPS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`1. Send 3 transactions to pool: ${pool.address}`);
  console.log('   ');
  console.log('   TX 1: 1000 sats + 10000 Token A');
  console.log('   TX 2: 1000 sats + 20000 Token B');
  console.log('   TX 3: 1000 sats + 0 LP Token');
  console.log('');
  console.log('2. Verify pool has 3 UTXOs');
  console.log('3. Start frontend: npm run dev');
  console.log('4. Test swap functionality\n');
  
  console.log('💡 TIP: Use Cashonize to send the 3 initialization transactions.\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});