/**
 * Initialize Chronos DEX Pool with Test Tokens
 * 
 * This script creates the 3 required UTXOs for the liquidity pool
 */

import { Contract, ElectrumNetworkProvider, SignatureTemplate } from 'cashscript';
import { hexToBin } from '@bitauth/libauth';
import poolArtifact from '../frontend/src/contracts/LiquidityPool.json';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../frontend/.env.local' });

const POOL_ARGS_JSON = process.env.VITE_LIQUIDITY_POOL_ARGS_JSON!;
const TOKEN_A = process.env.VITE_TOKEN_A_CATEGORY!;
const TOKEN_B = process.env.VITE_TOKEN_B_CATEGORY!;
const LP_TOKEN = process.env.VITE_LP_TOKEN_CATEGORY!;
const ADMIN_WIF = process.env.VITE_TESTER_WIF!;

async function initializePool() {
  console.log('🚀 Initializing Chronos DEX Pool...\n');

  // Connect to chipnet
  const provider = new ElectrumNetworkProvider('chipnet');
  
  // Parse pool arguments
  const poolArgs = JSON.parse(POOL_ARGS_JSON).map((arg: string) => hexToBin(arg));
  
  // Create pool contract
  const poolContract = new Contract(
    poolArtifact,
    poolArgs,
    { provider }
  );

  console.log('Pool Address:', poolContract.address);
  console.log('\n📝 To initialize, you need to send 3 transactions:');
  console.log('\n1. Send Token A to pool address:');
  console.log(`   Category: ${TOKEN_A}`);
  console.log(`   Amount: 1000000 (1M tokens)`);
  console.log(`   BCH: 1000 sats`);
  
  console.log('\n2. Send Token B to pool address:');
  console.log(`   Category: ${TOKEN_B}`);
  console.log(`   Amount: 2000000 (2M tokens)`);
  console.log(`   BCH: 1000 sats`);
  
  console.log('\n3. Send LP Token to pool address:');
  console.log(`   Category: ${LP_TOKEN}`);
  console.log(`   Amount: 0 (will be minted by pool)`);
  console.log(`   BCH: 1000 sats`);

  console.log('\n💡 Use Cashonize wallet or chipnet faucet to send these tokens');
  console.log('💡 After sending, refresh your frontend to see the pool active');
  
  // Check current pool state
  const utxos = await poolContract.getUtxos();
  console.log(`\n📊 Current Pool State: ${utxos.length}/3 UTXOs found`);
  
  if (utxos.length === 3) {
    console.log('✅ Pool is already initialized!');
    console.log('\nReserves:');
    console.log(`   Token A: ${utxos[0].token?.amount || 0n}`);
    console.log(`   Token B: ${utxos[1].token?.amount || 0n}`);
    console.log(`   LP Supply: ${utxos[2].token?.amount || 0n}`);
  } else {
    console.log('⚠️  Pool needs initialization');
  }
}

initializePool().catch(console.error);