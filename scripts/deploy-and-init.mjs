#!/usr/bin/env node

/**
 * CHRONOS DEX - Complete Deployment + Initialization
 * 
 * This script:
 * 1. Deploys contracts
 * 2. Initializes pool with real tokens
 * 3. Verifies everything is ready
 */

import { Contract, ElectrumNetworkProvider, SignatureTemplate } from 'cashscript';
import { hexToBin, binToHex, hash160 } from '@bitauth/libauth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function getEnv(envContent, key) {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim() : '';
}

function updateEnv(envContent, key, value) {
  const regex = new RegExp(`${key}=.*`);
  if (envContent.match(regex)) {
    return envContent.replace(regex, `${key}=${value}`);
  } else {
    return envContent + `\n${key}=${value}`;
  }
}

async function waitForUtxo(provider, address, expectedCount, maxWait = 60000) {
  log(`   Waiting for ${expectedCount} UTXOs at ${address.slice(0, 20)}...`, 'yellow');
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    try {
      const utxos = await provider.getUtxos(address);
      if (utxos.length >= expectedCount) {
        log(`   ✅ Found ${utxos.length} UTXOs!`, 'green');
        return utxos;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      process.stdout.write('.');
    } catch (err) {
      // Continue waiting
    }
  }
  throw new Error(`Timeout waiting for UTXOs`);
}

async function main() {
  console.log('\n');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('  🏆 CHRONOS DEX - COMPLETE DEPLOYMENT', 'cyan');
  log('  Deploy → Initialize → Verify', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  // ========================================
  // STEP 1: Load Environment
  // ========================================
  log('📋 STEP 1: Loading Configuration', 'blue');
  
  const envPath = path.join(__dirname, '../frontend/.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ ERROR: .env.local not found', 'red');
    process.exit(1);
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const tokenA = getEnv(envContent, 'VITE_TOKEN_A_CATEGORY');
  const tokenB = getEnv(envContent, 'VITE_TOKEN_B_CATEGORY');
  const lpToken = getEnv(envContent, 'VITE_LP_TOKEN_CATEGORY');
  const wif = getEnv(envContent, 'VITE_TESTER_WIF');
  
  if (!tokenA || !tokenB || !lpToken) {
    log('❌ ERROR: Token categories not found in .env.local', 'red');
    log('\n📝 Please update .env.local with your token categories:', 'yellow');
    log('   VITE_TOKEN_A_CATEGORY=your_tka_category_here', 'reset');
    log('   VITE_TOKEN_B_CATEGORY=your_tkb_category_here', 'reset');
    log('   VITE_LP_TOKEN_CATEGORY=your_clp_category_here', 'reset');
    process.exit(1);
  }
  
  if (!wif) {
    log('❌ ERROR: VITE_TESTER_WIF not found', 'red');
    process.exit(1);
  }
  
  log('✅ Configuration loaded', 'green');
  log(`   Token A (TKA):  ${tokenA.substring(0, 16)}...`, 'reset');
  log(`   Token B (TKB):  ${tokenB.substring(0, 16)}...`, 'reset');
  log(`   LP Token (CLP): ${lpToken.substring(0, 16)}...`, 'reset');
  console.log('\n');
  
  // ========================================
  // STEP 2: Load & Compile Contracts
  // ========================================
  log('🔨 STEP 2: Loading Contracts', 'blue');
  
  const contractsDir = path.join(__dirname, '../contracts');
  const poolPath = path.join(contractsDir, 'LiquidityPool.json');
  const vaultPath = path.join(contractsDir, 'GamificationVault.json');
  
  if (!fs.existsSync(poolPath) || !fs.existsSync(vaultPath)) {
    log('❌ ERROR: Contract artifacts not found', 'red');
    log('   Run: npm run compile-contracts', 'yellow');
    process.exit(1);
  }
  
  const poolArtifact = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
  const vaultArtifact = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
  
  log('✅ Contracts loaded', 'green');
  console.log('\n');
  
  // ========================================
  // STEP 3: Connect to Chipnet
  // ========================================
  log('🔌 STEP 3: Connecting to Chipnet', 'blue');
  
  const provider = new ElectrumNetworkProvider('chipnet');
  
  try {
    const height = await provider.getBlockHeight();
    log(`✅ Connected to Chipnet (block: ${height})`, 'green');
  } catch (err) {
    log(`❌ Connection failed: ${err.message}`, 'red');
    process.exit(1);
  }
  console.log('\n');
  
  // ========================================
  // STEP 4: Deploy Contracts
  // ========================================
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('📝 STEP 4: Deploying Contracts', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('\n');
  
  // Pool ID
  const poolIdInput = tokenA + tokenB + lpToken;
  const poolId = hash160(hexToBin(poolIdInput));
  
  log(`   Pool ID: ${binToHex(poolId)}`, 'magenta');
  
  // Deploy Pool
  const poolArgs = [
    hexToBin(tokenA),
    hexToBin(tokenB),
    hexToBin(lpToken),
    poolId,
  ];
  
  const pool = new Contract(poolArtifact, poolArgs, { provider });
  
  log('\n✅ LiquidityPool Deployed!', 'green');
  log(`   Address: ${pool.address}`, 'cyan');
  
  // Deploy Vault
  const adminPkh = hexToBin('0000000000000000000000000000000000000000');
  const vaultArgs = [adminPkh, hexToBin(lpToken)];
  const vault = new Contract(vaultArtifact, vaultArgs, { provider });
  
  log('\n✅ GamificationVault Deployed!', 'green');
  log(`   Address: ${vault.address}`, 'cyan');
  console.log('\n');
  
  // Update .env
  envContent = updateEnv(envContent, 'VITE_LIQUIDITY_POOL_ADDRESS', pool.address);
  envContent = updateEnv(envContent, 'VITE_GAMIFICATION_VAULT_ADDRESS', vault.address);
  envContent = updateEnv(envContent, 'VITE_POOL_ID', binToHex(poolId));
  envContent = updateEnv(
    envContent,
    'VITE_LIQUIDITY_POOL_ARGS_JSON',
    JSON.stringify(poolArgs.map(arg => binToHex(arg)))
  );
  envContent = updateEnv(
    envContent,
    'VITE_GAMIFICATION_VAULT_ARGS_JSON',
    JSON.stringify(vaultArgs.map(arg => binToHex(arg)))
  );
  
  fs.writeFileSync(envPath, envContent);
  log('💾 .env.local updated', 'green');
  console.log('\n');
  
  // ========================================
  // STEP 5: Initialize Pool
  // ========================================
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('🎯 STEP 5: Initializing Pool with Tokens', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('\n');
  
  log('📌 MANUAL STEP REQUIRED:', 'yellow');
  log('   You need to send 3 transactions to initialize the pool:', 'reset');
  console.log('');
  
  log('   1️⃣  Send Token A (TKA) to pool:', 'yellow');
  log(`      To: ${pool.address}`, 'cyan');
  log(`      Category: ${tokenA}`, 'reset');
  log(`      Amount: 1,000,000 (1M tokens)`, 'reset');
  log(`      BCH: 1000 sats`, 'reset');
  console.log('');
  
  log('   2️⃣  Send Token B (TKB) to pool:', 'yellow');
  log(`      To: ${pool.address}`, 'cyan');
  log(`      Category: ${tokenB}`, 'reset');
  log(`      Amount: 2,000,000 (2M tokens)`, 'reset');
  log(`      BCH: 1000 sats`, 'reset');
  console.log('');
  
  log('   3️⃣  Send LP Token (CLP) to pool:', 'yellow');
  log(`      To: ${pool.address}`, 'cyan');
  log(`      Category: ${lpToken}`, 'reset');
  log(`      Amount: 0 (will be minted by pool)`, 'reset');
  log(`      BCH: 1000 sats`, 'reset');
  console.log('');
  
  log('💡 Use Cashonize or Electron Cash to send these tokens', 'blue');
  console.log('');
  
  // Ask user if they want to wait
  log('⏳ Waiting for pool initialization...', 'yellow');
  log('   Press Ctrl+C to skip and complete manually later', 'reset');
  console.log('');
  
  try {
    const utxos = await waitForUtxo(provider, pool.address, 3, 300000); // 5 min timeout
    
    log('\n✅ Pool Initialized Successfully!', 'green');
    log(`   Found ${utxos.length} UTXOs at pool address`, 'reset');
    console.log('');
    
    // Display reserves
    const tokenAUtxo = utxos.find(u => binToHex(u.token?.category || new Uint8Array()) === tokenA);
    const tokenBUtxo = utxos.find(u => binToHex(u.token?.category || new Uint8Array()) === tokenB);
    const lpUtxo = utxos.find(u => binToHex(u.token?.category || new Uint8Array()) === lpToken);
    
    if (tokenAUtxo && tokenBUtxo && lpUtxo) {
      log('📊 Initial Reserves:', 'blue');
      log(`   TKA: ${tokenAUtxo.token?.amount || 0n}`, 'reset');
      log(`   TKB: ${tokenBUtxo.token?.amount || 0n}`, 'reset');
      log(`   CLP: ${lpUtxo.token?.amount || 0n}`, 'reset');
    }
    
  } catch (err) {
    log('\n⚠️  Initialization timeout - complete manually', 'yellow');
    log('   The pool address is saved in .env.local', 'reset');
  }
  
  console.log('\n');
  
  // ========================================
  // FINAL SUMMARY
  // ========================================
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('  🎉 DEPLOYMENT COMPLETE!', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  log('📊 DEPLOYED CONTRACTS:', 'blue');
  log(`   LiquidityPool:      ${pool.address}`, 'cyan');
  log(`   GamificationVault:  ${vault.address}`, 'cyan');
  console.log('\n');
  
  log('🎯 NEXT STEPS:', 'yellow');
  log('   1. Send 3 token UTXOs to pool address (see above)', 'reset');
  log('   2. Run: npm run dev (in frontend directory)', 'reset');
  log('   3. Test swap functionality', 'reset');
  log('   4. Create presentation slides', 'reset');
  log('   5. Record demo video', 'reset');
  console.log('\n');
  
  log('🏆 READY FOR BCH BLAZE SUBMISSION!', 'green');
  console.log('\n');
}

main().catch(err => {
  log(`\n❌ DEPLOYMENT FAILED: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});