#!/usr/bin/env node

/**
 * CHRONOS DEX - Simple Placeholder Generator
 * 
 * Generates 3 random 64-character hex strings to use as placeholder
 * token categories while you set up real token minting.
 */

import crypto from 'crypto';
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

function generateRandomCategory() {
  return crypto.randomBytes(32).toString('hex');
}

function updateEnv(envContent, key, value) {
  const regex = new RegExp(`${key}=.*`);
  if (envContent.match(regex)) {
    return envContent.replace(regex, `${key}=${value}`);
  } else {
    return envContent + `\n${key}=${value}`;
  }
}

function main() {
  console.log('\n');
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('  CHRONOS DEX - Placeholder Token Category Generator', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  log('⚠️  IMPORTANT:', 'yellow');
  log('These are PLACEHOLDER categories for testing deployment.', 'yellow');
  log('You will need to mint REAL tokens before final submission!', 'yellow');
  console.log('\n');
  
  // Generate 3 random categories
  const tokenA = generateRandomCategory();
  const tokenB = generateRandomCategory();
  const lpToken = generateRandomCategory();
  
  log('📋 Generated Placeholder Categories:', 'blue');
  console.log('\n');
  log(`Token A (CHRONOS):`, 'magenta');
  log(`${tokenA}`, 'cyan');
  console.log('\n');
  log(`Token B (TEMPUS):`, 'magenta');
  log(`${tokenB}`, 'cyan');
  console.log('\n');
  log(`LP Token (CHR-TMP-LP):`, 'magenta');
  log(`${lpToken}`, 'cyan');
  console.log('\n');
  
  // Check if .env.local exists
  const envPath = path.join(__dirname, '../frontend/.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local not found', 'red');
    log('\nCreating new .env.local file...', 'yellow');
    
    const newEnv = `# Chronos DEX Environment Variables

# Wallet (Get from Cashonize: Settings → Security → Show Private Key)
VITE_TESTER_WIF=

# Token Categories (PLACEHOLDERS - Replace with real tokens later!)
VITE_TOKEN_A_CATEGORY=${tokenA}
VITE_TOKEN_B_CATEGORY=${tokenB}
VITE_LP_TOKEN_CATEGORY=${lpToken}

# Network
VITE_NETWORK=chipnet

# Contract Addresses (Filled by deployment script)
VITE_LIQUIDITY_POOL_ADDRESS=
VITE_GAMIFICATION_VAULT_ADDRESS=
VITE_SWAP_ROUTER_ADDRESS=
VITE_POOL_ID=
VITE_LIQUIDITY_POOL_ARGS_JSON=
VITE_GAMIFICATION_VAULT_ARGS_JSON=
`;
    
    fs.writeFileSync(envPath, newEnv);
    log('✅ Created frontend/.env.local', 'green');
    console.log('\n');
    log('⚠️  Don\'t forget to add your VITE_TESTER_WIF!', 'yellow');
  } else {
    log('✅ Found existing .env.local', 'green');
    console.log('\n');
    log('Would you like to update it with these placeholders? (y/n)', 'yellow');
    log('Or manually copy the categories above into your .env.local', 'yellow');
    console.log('\n');
    
    // Read and update
    try {
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = updateEnv(envContent, 'VITE_TOKEN_A_CATEGORY', tokenA);
      envContent = updateEnv(envContent, 'VITE_TOKEN_B_CATEGORY', tokenB);
      envContent = updateEnv(envContent, 'VITE_LP_TOKEN_CATEGORY', lpToken);
      
      // Create backup
      fs.writeFileSync(envPath + '.backup', fs.readFileSync(envPath));
      log('📦 Created backup: .env.local.backup', 'blue');
      
      // Write updated file
      fs.writeFileSync(envPath, envContent);
      log('✅ Updated .env.local with placeholder categories', 'green');
    } catch (err) {
      log(`⚠️  Could not auto-update: ${err.message}`, 'yellow');
      log('Please manually copy the categories above', 'yellow');
    }
  }
  
  console.log('\n');
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('  NEXT STEPS', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  log('1️⃣  Verify your .env.local has:', 'blue');
  log('   ✓ VITE_TESTER_WIF (your Chipnet WIF)', 'reset');
  log('   ✓ Token categories (just added!)', 'reset');
  console.log('\n');
  
  log('2️⃣  Deploy your contracts:', 'blue');
  log('   cd scripts', 'cyan');
  log('   node deploy-contracts.mjs', 'cyan');
  console.log('\n');
  
  log('3️⃣  Later (before submission), mint REAL tokens:', 'blue');
  log('   Option A: Use Electron Cash (recommended)', 'reset');
  log('             https://electroncash.org/', 'cyan');
  log('   Option B: Use Paytaca wallet', 'reset');
  log('             https://www.paytaca.com/', 'cyan');
  log('   Option C: Wait for Cashonize to work again', 'reset');
  console.log('\n');
  
  log('4️⃣  Update .env.local with real token categories', 'blue');
  console.log('\n');
  
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('  WHY PLACEHOLDERS ARE OK FOR NOW', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');
  console.log('\n');
  
  log('✅ Your contracts will compile and deploy', 'green');
  log('✅ You can test the frontend interface', 'green');
  log('✅ Judges can verify your Layla CHIPs usage', 'green');
  log('✅ Your architecture is fully demonstrable', 'green');
  console.log('\n');
  
  log('⚠️  Before final submission, you MUST:', 'yellow');
  log('   - Mint real tokens you control', 'reset');
  log('   - Update the categories in .env.local', 'reset');
  log('   - Create demo video with actual swaps', 'reset');
  console.log('\n');
  
  log('🎯 Current Status: Ready to deploy contracts!', 'green');
  console.log('\n');
}

main();